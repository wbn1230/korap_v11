const dbConfig = {
  user: "postgres",
  password: "aQYqPlIa8Hs7WjVhxK8q",
  host: "korap-db-v1.ccczjtqpcai2.ap-northeast-2.rds.amazonaws.com",
  port: "5432",
  database: "korap_test",
};

const dbConfigBeta = {
  user: "mimlab3",
  password: "yP{q3ja}VLMS",
  host: "korap-v2-test.ccczjtqpcai2.ap-northeast-2.rds.amazonaws.com",
  port: "5432",
  ssl: {
    rejectUnauthorized: false,
  }, // fetch error on localhost
  database: "korap_test_v2",
};

module.exports = {
  dbConfig: dbConfig,
  dbConfigBeta: dbConfigBeta,
};
