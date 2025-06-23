module.exports = {
    testEnvironment: "jsdom",
    transform: {
      "^.+\\.(ts|tsx)$": "babel-jest"
    },
    moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
    testMatch: ["**/?(*.)+(test).[tj]s?(x)"],
    setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
    moduleNameMapping: {
      "\\.(css|less|scss|sass)$": "identity-obj-proxy"
    },
    globals: {
      "ts-jest": {
        tsconfig: "tsconfig.json"
      }
    }
  };
  