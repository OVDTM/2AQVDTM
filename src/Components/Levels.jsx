import '../css/levels.css';

export default function Levels() {
  return (
    <div className="levels-container">
      <div className='level-col'>
        <h1 className='title'>Niveau du silo 1</h1>
        <div className='level-visualizer'>
            <div className='level-fill' style={{ height: '70%' }}></div>
        </div>
        <h1 className='percentage-label'>70%</h1>
      </div>

      <div className='level-col'>
        <h1 className='title'>Niveau du silo 2</h1>
        <div className='level-visualizer'>
            <div className='level-fill' style={{ height: '80%' }}></div>
        </div>
        <h1 className='percentage-label'>80%</h1>
      </div>

      <div className='level-col'>
        <h1 className='title'>Niveau du silo 3</h1>
        <div className='level-visualizer'>
            <div className='level-fill' style={{ height: '90%' }}></div>
        </div>
        <h1 className='percentage-label'>90%</h1>
      </div>

      <div className='level-col'>
        <h1 className='title'>Niveau du silo 4</h1>
        <div className='level-visualizer'>
            <div className='level-fill' style={{ height: '60%' }}></div>
        </div>
        <h1 className='percentage-label'>60%</h1>
      </div>
    </div>
    )
}