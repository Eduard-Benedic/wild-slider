import React, {useRef, useEffect} from 'react'
import PropTypes from 'prop-types'
import gsap from 'gsap/gsap-core'



const SliderItem = ({url}) => {
      const current = useRef(null)
      
      useEffect(() => {
            gsap.to(current.current, {opacity: 1, delay: 1})
      }, [current])

      return (<img ref={current} style={{width: '100%', objectFit: 'cover', opacity: 0}} alt="okay" src={url} />)
}


SliderItem.propTypes = {
      url: PropTypes.string.isRequired,   
}

export default SliderItem;

