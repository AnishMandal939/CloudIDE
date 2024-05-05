import restartServer from './RestartServer';

function RestartButton() {
  return (
    <button className='restart-server-button' onClick={restartServer}>
      Restart Server
    </button>
  );
}

export default RestartButton;