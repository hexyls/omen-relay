const fetch = require("node-fetch");

const { BICONOMY_API_KEY, BICONOMY_URL } = require("./constants");

export const relay = async (payload) => {
  const response = await fetch(BICONOMY_URL, {
    method: "POST",
    headers: {
      "x-api-key": BICONOMY_API_KEY,
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(payload),
  });
  const json = await response.json();
  if (response.status !== 200) {
    throw new Error(json.message);
  } else {
    return json;
  }
};
