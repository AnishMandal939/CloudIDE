function restartServer() {
    fetch('http://localhost:9000/restart', {
      method: 'POST',
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      console.log('Server restart initiated');
    })
    .catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
    });
  }

export default restartServer;