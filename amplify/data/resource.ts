import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

/*== STEP 1 ===============================================================
The section below creates a Todo database table with a "content" field. Try
adding a new "isDone" field as a boolean. The authorization rule below
specifies that any unauthenticated user can "create", "read", "update", 
and "delete" any "Todo" records.
=========================================================================*/
const schema = a.schema({
  Todo: a
    .model({
      content: a.string(),
      isDone: a.boolean()
    })
    .authorization((allow) => [allow.owner()]),

  Profile: a.model({
    name: a.string(),
    phone: a.phone(),
    email: a.email(),
    picture: a.string(),
    myself: a.enum(["Investor", "Trader", "Both"]),
    interest: a.string().array(),
    ntoken: a.string(),
    status: a.boolean(),
    trader: a.enum(["EU", "AS", "US", "CA"]),
    watchlist: a.string().array(),
    settings: a.json()
  }).authorization(allow => [allow.owner()]),

  Alert: a.model({
    user_id: a.email().required(),
    identifier: a.string().required(),
    signal: a.enum(["price", "percent"]),
    condition: a.enum(["above", "below"]),
    value: a.float(),
    type: a.enum(["dod", "gtc"]),
    triggered_at: a.datetime(),
    email: a.boolean(),
    notification: a.boolean(),
    isDeleted: a.boolean(),
    status: a.boolean(),
    etf: a.boolean(),
  }).authorization(allow => [allow.owner()])
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
