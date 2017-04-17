import eslint from 'eslint';
import rule from '../../src/rules/must-dispose-event-subscriber';

const ruleTester = new eslint.RuleTester({ parser: 'babel-eslint' });

ruleTester.run('must-dispose-event-subscriber', rule, {
  valid: [
    {
      code: `
        export class AureliaComponent {
          attached() {
            this.myAureliaEventSubscriber = this.eventAggregator.subscribe('my-aurelia-event', () => {});
          }
          detached() {
            this.myAureliaEventSubscriber.dispose();
          }
        }
        `
    }
  ],
  invalid: [
    {
      code: `
        export class AureliaComponent {
          attached() {
            this.myAureliaEventSubscriber = this.eventAggregator.subscribe('my-aurelia-event', () => {});
            this.myAureliaEventSubscriber2 = this.eventAggregator.subscribe(Events.EventGroup.MyEvent, () => {});
          }
        }
      `,
      errors: [{
        message: `Component AureliaComponent subscribed 'my-aurelia-event' but does not dispose.`,
        type: 'ClassDeclaration'
      },
      {
        message: `Component AureliaComponent subscribed 'MyEvent' but does not dispose.`,
        type: 'ClassDeclaration'
      }]
    }
  ]
});
