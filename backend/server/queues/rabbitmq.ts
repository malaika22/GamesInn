import { BrokerAsPromised, BrokerConfig, PublicationSession, SubscriberSessionAsPromised } from 'rascal';
import { RabbitMQ } from '../../interfaces/appconfig';
import { TestEventListener } from '../../listeners/listener';
import { Sentry } from '../sentry';

/**
 * @NOTE : Following Class is dependent on Rascal Wrapper for RabbitMQ on nodejs. It is a library based on configuration object and
 * we doesn't have to do much and it handles underlying core funcionalties based on the configuration we provided.
 * For More information visit following Link :
 * https://www.npmjs.com/package/rascal
 * 
 * For More Details Conceptions Please Visit Following Links for better understanding.
 *   1. Basic Tutorial : https://www.rabbitmq.com/tutorials/tutorial-one-javascript.html
     2. Persistence : https://www.rabbitmq.com/tutorials/tutorial-two-javascript.html
     3. Guranteed Delivery : https://www.rabbitmq.com/confirms.html
     4. Persistence Configuration Guide : https://www.rabbitmq.com/persistence-conf.html
     5. Reliability : https://www.rabbitmq.com/reliability.html
     6. Monitoring : https://www.rabbitmq.com/monitoring.html
     7. Logging : https://www.rabbitmq.com/logging.html
     8. Prefetch Explainations : https://www.cloudamqp.com/blog/how-to-optimize-the-rabbitmq-prefetch-count.html
     9. Throughput, Latency and Bandwith : https://blog.rabbitmq.com/posts/2012/05/some-queuing-theory-throughput-latency-and-bandwidth
    10. Common Mistakes : https://www.cloudamqp.com/blog/part4-rabbitmq-13-common-errors.html
    11. Best Practices : https://www.cloudamqp.com/blog/part1-rabbitmq-best-practice.html
    12. High Availabaility : https://www.cloudamqp.com/blog/part3-rabbitmq-best-practice-for-high-availability.html
    13. High Performance : https://www.cloudamqp.com/blog/part2-rabbitmq-best-practice-for-high-performance.html
    14. RabbitMQ RPC : https://www.rabbitmq.com/tutorials/tutorial-six-javascript.html
    15. Alarms : https://www.rabbitmq.com/alarms.html
    16. Delivery Ack Timeout : https://www.rabbitmq.com/consumers.html#acknowledgement-timeout
    17. Consumer Timeout : https://www.rabbitmq.com/consumer-priority.html
    18. Lazy Queues : https://www.rabbitmq.com/lazy-queues.html
    19. Message Routing : https://www.rabbitmq.com/tutorials/tutorial-four-javascript.html
    20. Topic Based Routing Multi Pattern : https://www.rabbitmq.com/tutorials/tutorial-five-javascript.html
*/

export abstract class RMQ {


    private static broker: BrokerAsPromised;

    private static publishTimeout = 10000;
    private static channels: { [key: string]: SubscriberSessionAsPromised } = {};

    private static conf: BrokerConfig;

    private static GenerateConfig(conf: RabbitMQ): BrokerConfig {
        return {
            vhosts: {
                '/': {
                    connection: {
                        slashes: true,
                        protocol: conf.protocol,        /** We're using amqp protocl but others protocols are also supported like STOMP | Websockets etc. Please take a look at rabbitmq official guide. */
                        hostname: conf.host,   /** ServerIP/Domain When RabbitMQ is deployed */
                        user: conf.user,            /** User which we've created with previliges after installing RabbitMQ */
                        password: conf.password,
                        port: conf.port || 5672,              /** Port where RAbbitMQ server is Running. @NOTE If RabbitMQ is not directly exposed on its port then leave it blank and proxying server will take care of rest */
                        options: {
                            heartbeat: 5         /** Pinging Interval in seconds */
                        },
                        socketOptions: {
                            timeout: 10000       /** Disconnect Channel After constantly ping fail for n milliseconds */
                        },
                        retry: {
                            min: 1000,           /** Minimum Retry Interval After Disconnection */
                            max: 60000,          /** Maximum Retry Interval After Disconnection */
                            factor: 2,           /** Randomization Factor for resolving retry interval */
                            strategy: 'exponential' /** Other Strategies like Linear can also be used. Please look at the RabbitMQ official guide for more information  */
                        },
                        // management: { /** If You want application to submit the result to the UI engine then uncomment following Object and configure it appropriately */
                        //     protocol: "http",
                        //     pathname: "/ui",
                        //     user: "guest",
                        //     password: "guest",
                        //     options: {
                        //         "timeout": 1000
                        //     }
                        // },
                    },
                    queues: { /** Following Section Will have Queue Configuration if any. Note Keyname doesn't have in impact but it is useful when subcribing to them then keyname will be used to acquire the configurations */
                        "test": {
                            assert: true, /** Will Insert the queue if not exist */
                            check: true, /** Will check if queue exist or not. @NOTE It has no impact when assert is true */
                            options: {
                                durable: true, /** It ensures that queue is persistent  */
                                deadLetterExchange: "deadletter_test_e", /** In case of too many failure or any other case for which we don't want to receive event any further that event will be published to this Exchange for manual use or any other action/monitoring etc  */
                                deadLetterRoutingKey: "#" /** '#' means all the event should be routed to whichever queues this exchange is associated */
                            }
                        },
                        "deadletter_test_q": {
                            assert: true,
                            check: true,
                            options: {
                                durable: true
                            }
                        }
                    },
                    exchanges: { /** Exchanges are front-end router of queues. When Queue is bounded behind exchange the routing strategies can be configured on Exchange for appropriate queue routing */
                        'deadletter_test_e': {
                            assert: true, /** Create Exchange if not exist */
                            check: true, /** Check if Exchange exisit or not. It doesn't have any impact when assert is true */
                            options: {
                                durable: true, /** Persistent Exchange */
                                autoDelete: false /** Prevent Exchange Deletion */
                            },
                            type: "direct", /** See other type at Rabbit MQ Guide. for eg fanout | topic etc */
                        },
                        'test_exchange': {
                            assert: true,
                            check: true,
                            options: {
                                durable: true,
                                autoDelete: false
                            },
                            type: 'direct',
                        },
                    },
                    bindings: { /** Binding works as glue between Exchange and queue. Rules between exchange and queues will be configured here  */
                        "test": {
                            source: "test_exchange", /** Name of Exchange for which we want to create binding */
                            destination: "test", /** Name of destination where exchange will deliver message */
                            destinationType: 'queue', /** Destination can be queue and any other exchange as well. In our case we will using queue */
                            bindingKey: "test" /** routing key. Currently we are using simple strings for routing but expressive and pattern based routing can also be done. See more details at RabbitMQ official guide */
                        },
                        'deadletter_test_e': {
                            source: "deadletter_test_e",
                            destination: "deadletter_test_q",
                            destinationType: 'queue',
                            bindingKey: '#'
                        }
                    },
                    subscriptions: {
                        "test": {
                            queue: "test", /** Queuname for which we can to open Events */
                            autoCreated: true, /** It Will queue if not exist */
                            prefetch: 5, /** Max Events it can consume to balance the workload */
                            contentType: "application/json", /** Check other contentTypes as well. It will serialize the event data as per informed contentType. @NOTE Invalid content event will occure if provided payload doesn't math the content type */
                            options: {
                                noAck: false, /** Disable the auto-acknowledgment for the event for gaurenteed delivery and processing */
                            },
                            retry: {
                                min: 1000, /** Minimum delay for which the event will be available for consumption again in case of Nack */
                                max: 60000, /** Maximum delay for which the event will be available for consumption again in case of Nack */
                                factor: 2, /** Randomizing delay for which the event will be available for consumption again in case of Nack between min and max */
                                strategy: 'exponential' /** See other strategies for which the event will be available for consumption again in case of Nack */
                            }
                        }
                    },
                    publications: {
                        "test": {
                            exchange: "test_exchange", /** Destination where this type of event will be published for consumption. @NOTE We're submitting to exchange if you want to submit directly to queue uncomment following property and comment this  */
                            // queue : 'smtp', /** If Destination is queue without exchange then uncomment this line of code */
                            confirm: true, /** For Gauranteed delivery and ensure persistency confirm ensure that message has been submitted for processing and prevent potential loss in rare senarios */
                            autoCreated: true, /** created publication type if not exist. In this case it will create Exchange if not exists */
                            options: {
                                persistent: true, /** It will immediately write to disk as soon as the event recieved if data is non critical change it to false. @NOTE See Transient queues as well for non-critical work and maximizing throughput by preventing the event to be stored on disk */
                                contentType: 'application/json' /** Content-type will be used for serializing data and consumer will parse data accordingly */
                            },
                            routingKey: "test" /** Useful when using exchanged it will route the data to appropriate queue for consumption */
                        }
                    }

                }
            }
        } as BrokerConfig
    }


    public static async INIT(conf: RabbitMQ) {
        try {

            this.conf = this.GenerateConfig(conf);
            this.broker = await BrokerAsPromised.create(this.conf);
            this.broker.on('error', async (error: any, msgID: any) => {
                // console.log('Broker Error : ', error);
                Sentry.Error(error, `RABBIT MQ ERROR MSGID : ${msgID}`);
            });

            this.broker.on('vhost_initialised', ({ vhost, connectionUrl }) => {
                console.log(`Vhost: ${vhost} was initialised using connection: ${connectionUrl}`);
            });

            this.broker.on('blocked', (reason, { vhost, connectionUrl }) => {
                console.log(`Vhost: ${vhost} was blocked using connection: ${connectionUrl}. Reason: ${reason}`);
            });

            this.broker.on('unblocked', ({ vhost, connectionUrl }) => {
                console.log(`Vhost: ${vhost} was unblocked using connection: ${connectionUrl}.`);
            });

            // await this.SubscribeChannel('smtp');
            // await this.SubscribeChannel('fcm');

        } catch (error) {
            console.log('Error in INIT QUEUE');
            console.log(error);
            throw error;
        }
    }


    /**
    * 
    * @NOTE : Following Function Should only be used when send critical work because it ensures gaurantee.
    * 
    * 
    * @param queueName : string
    * @param payload : { msg : string , data : any }
    * @returns string
    */

    public static async PublishMessageConfirm(queueName: 'test', payload: { msg: string; data: any }): Promise<string> {
        console.log(payload);

        return new Promise(async (resolve, reject) => {
            try {

                let session: PublicationSession;
                let validQueueName = false;
                let timeout = setTimeout(() => { throw new Error(`Publishing Timeout Occurred : ${queueName} : Payload : ${JSON.stringify(payload, undefined, 4)}`) }, this.publishTimeout);

                switch (queueName) {

                    case 'test':
                        validQueueName = true;
                        break
                    default:
                        validQueueName = false;
                        break;

                }

                if (validQueueName) {
                    session = await this.broker.publish(queueName, payload);
                    session.on("success", (messageID) => {
                        console.log('Message Published : ', messageID);
                        clearTimeout(timeout);
                        resolve(messageID);
                    });
                    session.on('error', (error) => {
                        clearTimeout(timeout);
                        console.log('error : ', error)
                        reject(`Message Publishing Error ${validQueueName}`);
                    });
                } else reject('Invalid Queue');

            } catch (error: any) {
                console.log('Error in Publishing Message To Queue', error);
                Sentry.Error(error, `Error in Publishing Event : To Queue ${queueName}`);

                throw error;
            }
        })

    }


    /**
     * 
     * @NOTE : Following Function Should only be used when send non critical work
     * because this will only be used when operation is fire and forget because it does have the change where data may loss due to non-gauranteed deivery
     * 
     * 
     * @param queueName : string
     * @param payload : { msg : string , data : any }
     * @returns string
     */
    public static async PublishMessage(queueName: 'test', payload: { msg: string; data: any }): Promise<void> {

        return new Promise(async (resolve, reject) => {
            try {

                let session: PublicationSession;
                let validQueueName = false;
                let timeout = setTimeout(() => {
                    session.abort();
                }, this.publishTimeout);

                switch (queueName) {
                    case 'test':
                        validQueueName = true;
                        break;
                    default:
                        validQueueName = false;
                        break;

                }

                if (validQueueName) {

                    /**
                     * Parameter confirm is false which means data may get loss due to network isse and not confirmation will be return for gaurantee
                     * it is useful in fire and forget cases
                     */
                    session = await this.broker.publish(queueName, payload, { confirm: false });
                    resolve();
                } else reject('Invalid Queue');

            } catch (error: any) {
                console.log('Error in Publishing Message To Queue', error);
                Sentry.Error(error, `Error in Publishing Event : To Queue ${queueName}`);
                throw error;
            }
        })

    }

    /**
     * 
     * @param queueName  :string
     * 
     * @NOTE : Following function will only open the channel and bind the generic event Handler. 
     * Look the in side function named Bind Events that is responsible for Binding Message Process w.r.t Subscription 
     */

    public static async SubscribeChannel(queueName: 'test') {

        try {
            let session = await this.broker.subscribe(queueName);
            session.on('invalid_content', (message, content, ackorNak) => {
                console.log('Invalid Content :', message);
                console.log('content : ', content);
                Sentry.Error(new Error('Invalid Payload Content'), `Invalid Content in ${session.name}`);
                ackorNak(new Error(JSON.stringify(content)), [{ immediateNack: true, requeue: false, xDeathFix: true, strategy: 'nack' }]);
            })

            session.on('redeliveries_exceeded', async (message, content, ackorNak) => {
                //DO Work
                console.log('Redeliveries Exceeded :', message);
                console.log('content : ', content);
                Sentry.Error(new Error('Redeliveries Exceeded'), `Redeliveries Exceeded in ${session.name}`);
                ackorNak(new Error(JSON.stringify(content)), [{ immediateNack: true, requeue: false, xDeathFix: true, strategy: 'nack' }]);
            });

            session.on('error', async (error: any) => {
                //DO Work
                Sentry.Error(new Error('Subscription Error'), `Subscription Error in ${session.name}`);
            });

            this.BindEvents(session, queueName);
            this.channels[queueName] = session;

        } catch (error: any) {

            console.log('error in subscribing Channel : ', queueName);
            Sentry.Error(error, 'QueueSubcription Error');
            throw error;
        }


    }


    /**
     * 
     * @param session : Object<SubscribedSession>
     * @param queueName : string
     * 
     * @NOTE Following will bind the Message Processors Located in their Respective files.
     */
    public static async BindEvents(session: SubscriberSessionAsPromised, queueName: string) {

        try {
            switch (queueName) {
                case 'test':
                    TestEventListener.BindListener(session)
                    break;
                default:
                    session.cancel();
                    Sentry.Error(new Error('Unknown QueueName For Event Binding'), `Unknow QUeueName : ${queueName}`);
                    break;
            }

        } catch (error: any) {
            console.log('error in Binding Event');
            Sentry.Error(error, 'Ereror in Binding Event');
            throw error;
        }


    }


    /**
     * 
     * @returns 
     * 
     * @NOTE : deferCloseChannel : <defaults to 10 secs>
     * Shutting down the broker will cancel all subscriptions, then wait a short amount of time for inflight messages to be acknowledged 
     * (configurable via the deferCloseChannel subscription property), before closing channels and disconnecting.
     * 
     */
    public static async Dispose() {
        try {
            if (this.broker) await this.broker.shutdown()
            else return;
        } catch (error: any) {
            console.log('Error in Disposing Rabbit MQ');
            Sentry.Error(error, 'Error In Queue Disposing');
            throw error;
        }
    }


















}