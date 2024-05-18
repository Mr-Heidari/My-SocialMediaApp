type props = {
  width:number,
  height:number,
  color?:string
}


const Loader = ({width , height,color}: props) => {
  return (
    <div>
        <img src="/assets/icons/Spinner-2.gif" alt="loader" width={width} height={height} className={`object-contain  ${color}`}/>
    </div>
  )
}

export default Loader