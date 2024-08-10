import React from "react";
import Spinner from "../assets/images/spinner.svg";

const Loading = () => {
    return (
        <div style={styles.overlay}>
            <div style={styles.spinnerContainer}>
                <img src={Spinner} alt="로딩" style={styles.spinner} />
            </div>
        </div>
    );
};

const styles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000, 
    },
    spinnerContainer: {
        textAlign: 'center',
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '10px',
        width: '100px',
        height: '100px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    spinner: {
        width: '100%',
    }
};

export default Loading;
