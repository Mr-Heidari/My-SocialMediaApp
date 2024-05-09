type props = {
  width:number,
  height:number
}


const Loader = ({width , height}: props) => {
  return (
    <div>
        <img src="/assets/icons/Spinner-2.gif" alt="loader" width={width} height={height} className="object-contain"/>
    </div>
  )
}

export default Loader