import express, { Request, Response, NextFunction } from "express";

const PORT = process.env.PORT ?? "3000";
const APP_DELAY = process.env.APP_DELAY ?? "4000";
const APP_NAME = process.env.APP_NAME ?? "Example app #1";

const portValue = parseInt(PORT, 10);
const appDelayValue = parseInt(APP_DELAY, 10);

const app = express();

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const sendSlackMessage = async (message: string) => {
  const slackWebHookUrl = process.env.SLACK_WEBHOOK_URL ?? "";
  if (slackWebHookUrl) {
    const messageBody = { text: message };
    await fetch(slackWebHookUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(messageBody),
    });
  }
};

const doSomething = async (message?: string) => {
  await delay(appDelayValue);
  console.group("Do something!!");
  console.info(`message=${message}`);

  if (message) {
    await sendSlackMessage(message);
  }

  console.groupEnd();
};

const testRoute = "/test";
app.get(testRoute, async (req: Request, res: Response, next: NextFunction) => {
  console.group(testRoute);
  console.info("request");

  const { name } = req.query;
  const nameValue = (name as string) ?? "visitor";
  const message = `${APP_NAME}: Hi! ${nameValue} 🙋 Hello world!!`;
  const responseModel = {
    message,
  };

  console.info("response");

  res.status(200).json(responseModel);

  console.info("after response");

  await doSomething(message);

  console.groupEnd();
});

app.listen(portValue, () => {
  console.log(`
  ################################################
  📡  Server listening on port: ${portValue}🛡️
  ################################################
`);
});
