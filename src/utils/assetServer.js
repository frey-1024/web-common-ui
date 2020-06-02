export default !process.env.IS_SERVER_RENDER ||
  !!(typeof window !== 'undefined' && window.document && window.document.createElement);
