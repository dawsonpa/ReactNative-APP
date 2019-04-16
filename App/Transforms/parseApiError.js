export default response => {
  return response.data.message || response.data.statusDescription
}
