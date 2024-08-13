import React, { useRef, useState } from "react";

const CustomVideoPlayer = ({ src,videoRef }) => {
    // const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(true);
    const [progress, setProgress] = useState(0);

    const handleVideoClick = () => {
        if (videoRef.current.paused) {
            videoRef.current.play();
            setIsPlaying(true);
        } else {
            videoRef.current.pause();
            setIsPlaying(false);
        }
    };

    const handleTimeUpdate = () => {
        const currentProgress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
        setProgress(currentProgress);
    };

    return (
        <div style={styles.container}>
            <video
                ref={videoRef}
                src={src}
                style={styles.video}
                onClick={handleVideoClick}
                onTimeUpdate={handleTimeUpdate}
                autoPlay
                muted
                loop
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
};

export default CustomVideoPlayer;
