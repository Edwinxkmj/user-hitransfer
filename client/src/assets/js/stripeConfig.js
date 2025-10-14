// const stripeKey = 'pk_test_Im01LUeBvuEBjBhiGzFhGpxT00dPqLZ80j'; // 测试
const stripeKey = 'pk_live_0J0cnhtAcO6KokF5VYSFMXo000e97MT97x'; //正式

const stripeOptions = {
    country: 'US',
    currency: 'usd',
    total: {
      label: 'Demo total',
      amount: 1000,
    },
    requestPayerName: true,
    requestPayerEmail: false
}

export { stripeKey, stripeOptions };