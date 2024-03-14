const amqp = require('amqplib/callback_api')
const CONN_URL = process.env.RMQ_CONN_URL;

let ch = null;

amqp.connect(CONN_URL, function (err, conn) {
    conn.createChannel(function (err, channel) {
        ch = channel;
    });
});

exports.publishToQueue = async (queueName, data) => {
    // console.log(queueName,data);
    console.log("----------------------inserted to queue----------------");
    await ch.assertQueue(queueName);
    let dataa = ch.sendToQueue(queueName, new Buffer.from(JSON.stringify(data)), { persistent: true });
    console.log(dataa, "---------------")
};

exports.consumeQueue = async (QUEUE_NAME, method) => {

    amqp.connect(CONN_URL, function (err, conn) {
        conn.createChannel(async function (err, ch) {
            await ch.assertQueue(QUEUE_NAME);
            ch.prefetch(1);
            ch.consume(QUEUE_NAME, async function (msg) {
                let out = msg.content.toString();
                console.log(out)
                out = JSON.parse(out)

                try {
                    await method(out); //todo ack(msg)& reject(msg) based on response
                    ch.ack(msg);
                } catch (err) {
                    ch.ack(msg);
                    //ch.reject(msg, true);
                    console.log("Somtheing ", err)
                }
            }, { noAck: false }
            );
        });
    });
}

process.on('exit', (code) => {
    ch.close();
    console.log(`Closing rabbitmq channel`);
});

