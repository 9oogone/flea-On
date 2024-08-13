import React, { useRef, useState } from "react";
import useDidMountEffect from "../utils/useDidMountEffect";
import muteImage from "./../assets/images/mute.svg";
import unMuteImage from "./../assets/images/unMute.svg";

const CustomVideoPlayer = ({ src,videoRef }) => {
    // const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(true);
    const [progress, setProgress] = useState(0);
    const [isMuted, setIsMuted] = useState(true);
    const [muteFlag, setMuteFlag] = useState(false)
    const [modal, setModal] = useState(false);

    const handleVideoClick = () => {
        setIsMuted(!isMuted)
        // if (videoRef.current.paused) {
        //     videoRef.current.play();
        //     setIsPlaying(true);
        // } else {
        //     videoRef.current.pause();
        //     setIsPlaying(false);
        // }
    };
    const handleMouseDown = ()=>{
        
        videoRef.current.pause();
        setIsPlaying(false);
        setTimeout(()=>{
            setMuteFlag(false);
        },300)
    }
    const handleMouseUp = ()=>{
        if(muteFlag){
            setIsMuted(!isMuted)
            setModal(true)
            setTimeout(()=>{
                setModal(false)
            },300)
        }
        videoRef.current.play();
        setIsPlaying(true);
    }

    const handleTimeUpdate = () => {
        const currentProgress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
        setProgress(currentProgress);
    };
    useDidMountEffect(()=>{
        setModal(true)
            setTimeout(()=>{
                setModal(false)
            },300)
    },[isMuted])

    return (
        <div style={styles.container}>
            <div style={{...styles.modalContainer, display:modal?'flex':'none'}}>
            <img src={isMuted?muteImage:unMuteImage} style={modal ? styles.modalImage : { ...styles.modalImage, ...styles.fadeOut }} alt="mute" />
            </div>
            <video
                ref={videoRef}
                src={src}
                style={styles.video}
                onClick={handleVideoClick}
                onTimeUpdate={handleTimeUpdate}
                autoPlay
                muted={isMuted}
                loop
                onTouchStart={handleMouseDown}
                onTouchEnd={handleMouseUp}
            />
            <div style={styles.progressBarContainer}>
                <div style={{ ...styles.progressBar, width: `${progress}%` }} />
            </div>
        </div>
    );
};

const styles = {
    container: {
        position: 'relative',
        width: '100%',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        backgroundColor: 'black',
    },
    video: {
        height: '100%',
        width: 'auto',
    },
    progressBarContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '3px',
        backgroundColor: '#e0e0e0',
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#ff0b55',
    },
    modalContainer: {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100,
        pointerEvents: 'none',
        transition: '0.5s ease fadeout',
        opacity: 1,
    },
    modalImage: {
        width: '100px',
        height: '100px',
    },
};

export default CustomVideoPlayer;
