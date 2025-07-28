export default function AudioPlayer({ audioUrl }) {
     
  
  
    return (
      
      <div className="w-full max-w-full overflow-hidden">
        <audio className="max-w-full" controls key={audioUrl}>
          <source src={audioUrl} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio> 
      </div>
    );
  }