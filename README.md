# Process Cloudfront Logs with AWS Lambda

This repo is a sample [Serverless Framework](https://serverless.com/) project which automatically watches for new Cloudfront web access logs, streams them from S3, and processes them line by line.


### Motivation

Often you'll want to do some kind of custom logging and analytics on your website, but creating and hosting the infrastructure for this can be time consuming and expensive.

Cloudfront will helpfully upload full access logs directly to an S3 bucket of your choice. This makes it an excellent analytics payload collector, and at the very affordable price of $1 per million requests, infinitely scalable and maintenance free.

By triggering an [AWS Lambda](https://aws.amazon.com/lambda/) function every time a new log file is uploaded to S3, you can instantly process and store each log entry. What you do with those entries is up to you--some ideas include an SQS queue for further processing, BigQuery, or maybe [Kinesis](https://aws.amazon.com/kinesis/).


### Proof Of Concept

Out of the box this function will only process Cloudfront log files, line by line, and print them to CloudWatch logs. Further processing of each log entry is left to you.


### Installation

First, install the Serverless Framework (installation instructions [here](https://serverless.com/framework/docs/providers/aws/guide/installation/)).

Open `serverless.yml` and change the `bucketName` variable to something unique. This is the S3 bucket that your access logs will end up in.

Then upload the function to AWS by running:

```
serverless deploy
```

This will create a brand new S3 bucket with the name you chose above. Next, tell Cloudfront to use that bucket for access logs:

![](http://i.imgur.com/SGhNWG2.png)

Now every request you make to your Cloudfront distribution will be logged, and every log file will be processed by your lambda function.


### Example Data

```
GET https://<yourdistribution>.cloudfront.net/?page=blog&ref=google.com
```

```json
{
    "id": "MfRFKrKkwL2UNbly3mFr6FIKE6WaIm4tKxBBHg3wWpxHLbv2v_vLew==",
    "timestamp": "2017-03-25 20:09:39",
    "ip": "127.0.0.1",
    "params": {
        "page": "blog",
        "ref": "google.com"
    }
}
```

Cloudfront automatically gives you a UTC timetamp, the request IP, a unique ID per log entry, the user agent, and much more. 

You could send data to Cloudfront from mobile apps or client-side javascript. All without managing a single server!
