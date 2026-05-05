import '../css/contentcontainer.css';

export default function ContentContainer(props) {
  return (
    <div className="content-container">
        {props.children}
    </div>
  );
}