module.exports = {
  roots: ["<rootDir>/src", "<rootDir>"],
  collectCoverageFrom: ["<rootDir>/src/**/*.ts", "!**/*.d.ts"],
  coverageDirectory: "coverage",
  testEnvironment: "node",
  transform: {
    ".+\\.ts$": "ts-jest",
  },
  moduleNameMapper: {
    "@/tests/(.*)": "<rootDir>/tests/$1",
    "@/(.*)": "<rootDir>/src/$1",
  },
};
