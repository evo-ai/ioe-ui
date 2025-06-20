module.exports = {
    testEnvironment: "jsdom",
    transform: {
      "^.+\\.(ts|tsx)$": "babel-jest"
    },
    moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
    testMatch: ["**/?(*.)+(test).[tj]s?(x)"]
  };
  