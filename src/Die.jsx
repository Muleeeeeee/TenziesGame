export default function Die(props) {
  return (
    <button className={props.isHeld ? "held" : null}
      onClick={props.toggleHold}>
        {props.value}
    </button>
  )
}
