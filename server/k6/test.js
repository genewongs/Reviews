import http from 'k6/http';

export let options = {
  insecureSkipTLSVerify: true,
  noConnectionReuse: false,
  scenarios: {
    constant_request_rate: {
      executor: 'constant-arrival-rate',
      rate: 10,
      timeUnit: '1s',
      duration: '30s',
      preAllocatedVUs: 100,
      maxVUs: 100,
    },
  },
}

export default () => {
  // GET Reviews
  http.get(`http://localhost:3000/reviews/?product_id=${Math.floor(Math.random() * 99999)}`);

  // // Get Metas
  // http.get(`http://localhost:3000/reviews/meta/?product_id=${Math.floor(Math.random() * 99999)}`);

  //POST request

  //Update Help

  //Update Reported

}


  // vus: 1,
  // // duration: '10',
  // stages: [
  //   { duration: '5s', target: 20 },
  //   { duration: '10s', target: 40 },
  //   { duration: '15s', target: 80 },
  //   { duration: '20s', target: 100 },
  //   { duration: '10s', target: 100 }
  // ]