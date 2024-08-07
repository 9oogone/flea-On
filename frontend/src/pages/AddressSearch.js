import React, { useEffect } from 'react';

const AddressSearch = () => {
    useEffect(() => {
        const scriptId = 'kakao-postcode-script';
        const loadPostcode = () => {
            const postcodeElement = document.getElementById('daum_postcode');
            if (!postcodeElement) return;

            new window.daum.Postcode({
                oncomplete: (data) => {
                    window.opener.postMessage({
                        address: data.address
                    }, "*");
                    window.close();
                }
            }).embed(postcodeElement);
        };

        if (!document.getElementById(scriptId)) {
            const script = document.createElement('script');
            script.id = scriptId;
            script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
            script.async = true;
            script.onload = () => {
                if (window.daum && window.daum.Postcode) {
                    loadPostcode();
                }
            };
            document.body.appendChild(script);
        } else {
            if (window.daum && window.daum.Postcode) {
                loadPostcode();
            }
        }

        return () => {
            const element = document.getElementById('daum_postcode');
            if (element) {
                element.innerHTML = '';
            }
        };
    }, []);

    return <div id="daum_postcode" style={{ width: '100%', height: '100%' }}></div>;
};

export default AddressSearch;
