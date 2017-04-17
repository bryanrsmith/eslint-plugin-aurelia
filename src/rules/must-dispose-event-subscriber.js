export default function mustDisposeEventSubscriber(context) {
  let isInComponent = false;
  let componentName = null;
  let subscribedEvents = [];
  let disposedEvents = [];

  return {
    'ClassDeclaration'(node) {
      isInComponent = true;
      componentName = node.id && node.id.name;
      subscribedEvents = [];
      disposedEvents = [];
    },
    'ClassDeclaration:exit'(node) {
      subscribedEvents.forEach(event => {
        if(disposedEvents.every(disposedEvent => disposedEvent.eventHandler !== event.eventHandler)) {
          context.report({
            node: node,
            message: `Component {{ComponentName}} subscribed '{{EventName}}' but does not dispose.`,
            data: {
              ComponentName: componentName,
              EventName: event.eventName
            }
          });
        }
      });

      isInComponent = false;
      componentName = null;
      subscribedEvents = [];
      disposedEvents = [];
    },
    'CallExpression'(node) {
      if(isInComponent && _isSubscribingEvent(node)) {
        let firstArg = node.arguments[0];
        let eventHandlerAssignmentExpr = node.parent;
        subscribedEvents.push({
          eventName: firstArg.type === 'Literal' ? firstArg.value : firstArg.type === 'MemberExpression' ? `${firstArg.property.name}` : null,
          eventHandler: eventHandlerAssignmentExpr.left && eventHandlerAssignmentExpr.left.property.name
        });
      }
      if(isInComponent && _isDisposingEvent(node)) {
        disposedEvents.push({
          eventHandler: node.callee.object.property.name
        });
      }
    }
  };
}

mustDisposeEventSubscriber.schema = [];


let _isSubscribingEvent = node => {
  let isCallingSubscribeMethod = node.callee.property && node.callee.property.name === 'subscribe';
  let hasTwoArguments = node.arguments.length === 2;
  let secondArg = node.arguments[1];
  let isSecondArgumentFunction = secondArg && secondArg.type === 'ArrowFunctionExpression' || secondArg && secondArg.type === 'FunctionExpression';
  return isCallingSubscribeMethod && hasTwoArguments && isSecondArgumentFunction;
};

let _isDisposingEvent = node => {
  return node.callee.property && node.callee.property.name === 'dispose';
};