//This class implements all methods to analyse trackers whithin a web page

import { resolveConfig } from "prettier";

export default function fingerprinterScript() {

    const computeScoreRatio = (obj, text) => {
        let score = 0;
        for (let key in obj) {
            let val = obj[key];
            let count = text.split(key).length - 1;
            if (count > 0) {
                score += parseInt(val);
            }
        }
        return score;
    }

    const cleanDomainName = (domain) => {
        if (domain[0] == '.') domain = domain.substr(1);
        if (domain.substr(0, 4) == "www.") domain = domain.substr(4);
        return domain;
    }

    const clamp = (min, num, max) => Math.min(Math.max(num, min), max);

    // Copyright (c) 2020 The University of Iowa - Internet Research Lab
    function findKeywordsOccurences(text_script) {
        const infinity_keywords = {
            "onpointerleave": "-1",
            "StereoPannerNode": "-1",
            "FontFaceSetLoadEvent": "-1",
            "PresentationConnectionAvailableEvent": "-1",
            "MediaDeviceInfo": "-1",
            "msGetRegionContent": "-1",
            "peerIdentity": "-1",
            "MSManipulationEvent": "-1",
            "VideoStreamTrack": "-1",
            "mozSetImageElement": "-1",
            "magnetometer": "-1",
            "requestWakeLock": "-1",
            "PresentationRequest": "-1",
            "audioWorklet": "-1",
            "onwebkitanimationiteration": "-1",
            "onpointerenter": "-1",
            "onwebkitanimationstart": "-1",
            "onlostpointercapture": "-1",
            "RTCCertificate": "-1",
            "PresentationConnectionList": "-1",
            "onMSVideoOptimalLayoutChanged": "-1",
            "PresentationAvailability": "-1",
            "BaseAudioContext": "-1",
            "activeVRDisplays": "-1",
            "BluetoothRemoteGATTCharacteristic": "-1",
            "VisualViewport": "-1",
            "PresentationConnection": "-1",
            "onMSVideoFormatChanged": "-1",
            "onMSVideoFrameStepCompleted": "-1",
            "BluetoothDevice": "-1"
        };

        const other_keywords = {
            "onuserproximity": "543.77",
            "ongotpointercapture": "362.52",
            "onpointerout": "362.52",
            "accelerometer": "326.71",
            "chargingchange": "302.10",
            "onafterscriptexecute": "217.51",
            "channelCountMode": "199.03",
            "getDevices": "187.62",
            "maxChannelCount": "184.44",
            "baseLatency": "181.26",
            "onpointerover": "181.26",
            "onbeforescriptexecute": "181.26",
            "onicegatheringstatechange": "179.78",
            "MediaDevices": "161.12",
            "numberOfInputs": "157.09",
            "channelInterpretation": "147.69",
            "speedOfSound": "140.98",
            "dopplerFactor": "140.98",
            "midi": "138.72",
            "ondeviceproximity": "131.35",
            "HTMLMenuItemElement": "121.40",
            "updateCommands": "120.84",
            "FRAGMENT_SHADER_DERIVATIVE_HINT_OES": "120.84",
            "getSupportedProfiles": "120.84",
            "initCompositionEvent": "120.84",
            "initAnimationEvent": "120.84",
            "vrdisplayfocus": "120.84",
            "initTransitionEvent": "120.84",
            "vrdisplayblur": "120.84",
            "exportKey": "105.97",
            "onauxclick": "90.63",
            "microphone": "90.43",
            "iceGatheringState": "90.30",
            "ondevicelight": "88.31",
            "renderedBuffer": "87.17",
            "WebGLContextEvent": "82.52",
            "ondeviceorientationabsolute": "80.56",
            "startRendering": "79.33",
            "createOscillator": "78.77",
            "knee": "76.65",
            "OfflineAudioContext": "74.68",
            "timeLog": "72.50",
            "getFloatFrequencyData": "72.50",
            "WEBGL_compressed_texture_atc": "72.50",
            "illuminance": "72.50",
            "reduction": "69.64",
            "modulusLength": "69.39",
            "WebGL2RenderingContext": "68.71",
            "enumerateDevices": "64.12",
            "AmbientLightSensor": "63.60",
            "attack": "61.31",
            "AudioWorklet": "60.42",
            "Worklet": "60.42",
            "AudioWorkletNode": "60.42",
            "lastStyleSheetSet": "60.42",
            "DeviceProximityEvent": "60.42",
            "DeviceLightEvent": "60.42",
            "enableStyleSheetsForSet": "60.42",
            "UserProximityEvent": "60.42",
            "vrdisplaydisconnect": "60.42",
            "mediaDevices": "60.03",
            "vibrate": "57.68",
            "vendorSub": "56.17",
            "setValueAtTime": "55.29",
            "getChannelData": "55.18",
            "MAX_DRAW_BUFFERS_WEBGL": "54.93",
            "reliable": "52.36",
            "WEBGL_draw_buffers": "52.09",
            "EXT_sRGB": "51.79",
            "setSinkId": "50.35",
            "namedCurve": "50.29",
            "minDecibels": "48.34",
            "UNKNOWN_ERR": "48.34",
            "WEBGL_debug_shaders": "45.31",
            "productSub": "42.79",
            "hardwareConcurrency": "41.92",
            "publicExponent": "41.52",
            "requestMIDIAccess": "40.28",
            "mozIsLocallyAvailable": "40.28",
            "ondevicemotion": "40.28",
            "maxDecibels": "40.28",
            "getLayoutMap": "40.28",
            "Animatable": "40.28",
            "GeckoActiveXObject": "40.28",
            "XPathResult": "39.73",
            "mozBattery": "39.04",
            "IndexedDB": "38.73",
            "generateKey": "37.46",
            "buildID": "36.52",
            "getSupportedExtensions": "36.46",
            "MAX_TEXTURE_MAX_ANISOTROPY_EXT": "35.85",
            "oscpu": "35.33",
            "oninvalid": "34.75",
            "vpn": "34.53",
            "lastEventID": "34.53",
            "mozCaptureStream": "34.53",
            "createDynamicsCompressor": "33.54",
            "privateKey": "33.46",
            "EXT_texture_filter_anisotropic": "32.91",
            "isPointInPath": "32.17",
            "getContextAttributes": "31.76",
            "BatteryManager": "31.23",
            "getShaderPrecisionFormat": "30.81",
            "depthFunc": "30.81",
            "uniform2f": "30.71",
            "rangeMax": "30.36",
            "rangeMin": "30.24",
            "EXT_disjoint_timer_query": "30.21",
            "scrollByPages": "30.21",
            "CanvasCaptureMediaStreamTrack": "30.21",
            "onlanguagechange": "30.21",
            "RTCDataChannelEvent": "30.21",
            "onMSFullscreenChange": "30.21",
            "clearColor": "29.16",
            "createWriter": "28.93",
            "getUniformLocation": "28.61",
            "getAttribLocation": "28.58",
            "drawArrays": "28.53",
            "useProgram": "28.37",
            "enableVertexAttribArray": "28.37",
            "createShader": "28.31",
            "compileShader": "28.30",
            "shaderSource": "28.27",
            "attachShader": "28.25",
            "bufferData": "28.24",
            "linkProgram": "28.23",
            "vertexAttribPointer": "28.22",
            "bindBuffer": "28.14",
            "createProgram": "27.95",
            "OES_standard_derivatives": "27.46",
            "appCodeName": "27.03",
            "getAttributeNodeNS": "26.49",
            "ARRAY_BUFFER": "25.36",
            "suffixes": "25.14",
            "TouchEvent": "25.01",
            "MIDIPort": "24.17",
            "MAX_COLOR_ATTACHMENTS_WEBGL": "24.17",
            "lowpass": "24.17",
            "onaudioprocess": "23.64",
            "showModalDialog": "23.56",
            "globalStorage": "23.48",
            "camera": "22.76",
            "onanimationiteration": "22.66",
            "webkitNotification": "21.97",
            "textBaseline": "21.76",
            "MediaStreamTrackEvent": "21.32",
            "deviceproximity": "21.13",
            "taintEnabled": "20.89",
            "alphabetic": "20.65",
            "userproximity": "20.28",
            "globalCompositeOperation": "20.15",
            "outputBuffer": "20.14",
            "WebGLUniformLocation": "20.14",
            "WebGLShaderPrecisionFormat": "20.14",
            "OffscreenCanvas": "20.14",
            "MIDIInput": "20.14",
            "ServiceWorkerContainer": "20.14",
            "pranswer": "20.14",
            "ScriptProcessorNode": "20.14",
            "MIDIAccess": "20.14",
            "vrdisplayconnect": "20.14",
            "customelements": "20.14",
            "SVGAnimationElement": "20.14",
            "createScriptProcessor": "20.14",
            "createBuffer": "19.98",
            "UIEvent": "19.93",
            "toSource": "19.54",
            "createAnalyser": "19.33",
            "fillRect": "19.22",
            "requestAutocomplete": "18.59",
            "evenodd": "18.49",
            "fillText": "18.09",
            "candidate": "18.03",
            "WEBGL_debug_renderer_info": "17.83",
            "toDataURL": "17.64",
            "dischargingTime": "17.53",
            "bluetooth": "17.28",
            "vrdisplaydeactivate": "17.26",
            "MediaKeySession": "17.26",
            "vrdisplayactivate": "17.26",
            "FLOAT": "16.89",
            "battery": "16.82",
            "devicelight": "16.51",
            "onanimationstart": "16.48",
            "getExtension": "16.43",
            "onemptied": "16.11",
            "captureStream": "16.11",
            "MediaStreamTrack": "15.90",
            "WebGLRenderingContext": "15.75",
            "oncomplete": "15.70",
            "onratechange": "15.59",
            "fillStyle": "15.55",
            "getGamepads": "15.10",
            "BiquadFilterNode": "15.10",
            "SVGZoomEvent": "15.10",
            "filterNumber": "15.10",
            "NotSupported": "15.10",
            "PermissionStatus": "15.10",
            "ignoreBOM": "15.10",
            "queryInfo": "15.10",
            "onspeechend": "15.10",
            "maxTouchPoints": "15.09",
            "frequencyBinCount": "14.87",
            "credential": "14.82",
            "iceTransportPolicy": "14.65",
            "iceCandidatePoolSize": "14.50",
            "DeviceMotionEvent": "14.26",
            "rtcpMuxPolicy": "14.22",
            "webgl": "14.17",
            "indexedDB": "13.92",
            "rotationAngle": "13.85",
            "setTargetAtTime": "13.73",
            "iceServers": "13.62",
            "clipboard": "13.59",
            "onconnectionstatechange": "13.43",
            "connectionstatechange": "13.43",
            "meetOrSlice": "13.43",
            "remoteCandidateId": "13.43",
            "channelCount": "13.17",
            "getParameter": "13.08",
            "selectionDirection": "13.01",
            "closePath": "12.98",
            "NetworkInformation": "12.95",
            "emma": "12.95",
            "createOffer": "12.68",
            "languages": "12.57",
            "setLocalDescription": "12.46",
            "requestFileSystem": "12.39",
            "createDataChannel": "12.33",
            "onicecandidate": "12.32",
            "Float32Array": "12.30",
            "requestPointerLock": "12.08",
            "ValidityState": "12.08",
            "onwebkitresourcetimingbufferfull": "12.08",
            "gathering": "12.08",
            "MediaQueryList": "12.08",
            "tooltipNode": "12.08",
            "drawWindow": "12.08",
            "Sensor": "12.08",
            "TEMPORARY": "12.05",
            "SpeechRecognition": "11.79",
            "recognition": "11.69",
            "beginPath": "11.59",
            "smoothingTimeConstant": "11.51",
            "systemLanguage": "11.50",
            "acceleration": "11.46",
            "multiply": "11.36",
            "arc": "11.35",
            "fonts": "11.35",
            "gbk": "11.33",
            "outerText": "11.31",
            "deriveBits": "11.19",
            "doNotTrack": "11.16",
            "publicKey": "11.07",
            "storageArea": "10.99",
            "EMS": "10.99",
            "xMaxYMin": "10.99",
            "DataError": "10.99",
            "remoteId": "10.99",
            "RTCPeerConnection": "10.97",
            "createMediaStreamSource": "10.74",
            "getImageData": "10.56",
            "bundlePolicy": "10.36",
            "PERSISTENT": "10.28",
            "ANGLE_instanced_arrays": "10.07",
            "hasPointerCapture": "10.07",
            "focusMode": "10.07",
            "xMidYMin": "10.07"
        };

        let res = computeScoreRatio(infinity_keywords, text_script);
        if (res == 0) {
            res = computeScoreRatio(other_keywords, text_script);
        }

        return res;
    }

    const computeScoreScript = new Promise((res, reject) => {
        // This class implements all methods to analyse trackers whithin a web page
        const scripts = document.scripts;
        let fp_inf = 0;
        let fp_total = 0;
        //  Score for external link
        let max_extern = 0;
        const nbScript = scripts.length;
        const loopScripts = () => {
            let promiseList = [];
            return new Promise((resolve, reject) => {
                let analysedScripts = 0;
                for (let i = 0; i < nbScript; i++) {
                    promiseList.push(new Promise((resolve, reject) => {
                        //When the cript references an external one
                        if (scripts[i].src) {
                            let externalSourceLink = scripts[i].src;
                            // Fetch file with blob
                            fetch(externalSourceLink).then((response) => {
                                if (response.ok) {
                                    response.blob().then((myBlob) => {
                                        // Get blob content
                                        myBlob.text().then((scriptContent) => {
                                            resolve();
                                            let fp_ratio = findKeywordsOccurences(scriptContent);
                                            if (fp_ratio < 0 && fp_ratio < max_extern) {
                                                max_extern = fp_ratio;
                                            } else if (fp_ratio >= 0 && max_extern >= 0 && fp_ratio > max_extern) {
                                                max_extern = fp_ratio;
                                            }
                                        }).catch((err) => {
                                            resolve();
                                        })
                                    }).catch((err) => {
                                        resolve();
                                    });
                                } else {
                                    resolve();
                                }
                            }).catch((err) => {
                                resolve();
                            });
                        } else {
                            const script_text = scripts[i].text;
                            let fp_ratio = findKeywordsOccurences(script_text);
                            if (fp_ratio < 0) {
                                fp_inf += fp_ratio;
                            } else {
                                fp_total += fp_ratio;
                            }
                            resolve();
                        }
                    }));
                }
                Promise.all(promiseList).then((res) => {
                    resolve();
                })
            })
        }
        loopScripts().then(() => {
            let final_score = 0;
            // When there is an infinite score
            if (fp_inf != 0) {
                fp_total = fp_inf;
                final_score = Math.min(0.9 + 3 * (1 - fp_total), 1);
            } else {
                // fp_total: Internal script absolute tracking score suspicion - max_extern: External script absolute tracking score suspicion
                // final_score : the aggregation of the two scores above, to get en overall tracking score suspicion
                if (fp_total < 0 || max_extern < 0) {
                    final_score = 1;
                } else {
                    const minVal = 10;
                    const maxVal = 230;
                    const x = (clamp(minVal, 0.4 * fp_total + 0.25 * max_extern, maxVal) - minVal) / (maxVal - minVal);
                    final_score = 1 / (1 + Math.exp((-15 * x + 401 / 100) * 1.03 - 0.015))
                }
            }

            final_score *= 100;
            const fingerprintAnalyseResult = {
                "fp_page": fp_total,
                "fp_extern": max_extern,
                "final_score": final_score,
                "url": window.location.hostname
            }
            res(fingerprintAnalyseResult);
        }).catch((error) => {
            reject(error)
        })
    });

    computeScoreScript.then((fingerprintAnalyseResult) => {

        // Set current fingerprint score
        chrome.storage.local.set({ "fingerprintAnalyseResult": fingerprintAnalyseResult });

        // Alter score history
        chrome.storage.local.get("scoreHistory", function (res) {
            let scoreHistory = {};
            if (res && res.scoreHistory) { scoreHistory = res.scoreHistory; }
            let currTimestamp = new Date();
            let currDate = currTimestamp.getDate() + "/" + currTimestamp.getMonth() + "/" + currTimestamp.getFullYear();
            if (scoreHistory[currDate] == undefined) {
                scoreHistory[currDate] = {
                    "trackerSum": fingerprintAnalyseResult.final_score,
                    "cookieSum": 0,
                    "totalCookie": 1,
                    "totalTracker": 0
                }
            }
            else {
                scoreHistory[currDate].trackerSum += fingerprintAnalyseResult.final_score;
                scoreHistory[currDate].totalTracker += 1;
            }
            chrome.storage.local.set({ "scoreHistory": scoreHistory });
        });

        // Update stored scores
        chrome.storage.local.get("websiteScores", function (res) {
            let websiteScores = {};
            if (res && res.websiteScores) { websiteScores = res.websiteScores; }
            let domain = cleanDomainName(window.location.hostname);
            if (websiteScores[domain] == undefined) {
                websiteScores[domain] = {
                    "tracker": fingerprintAnalyseResult.final_score,
                    "cookie": 0,
                }
            }
            else {
                websiteScores[domain].tracker = fingerprintAnalyseResult.final_score;
            }
            chrome.storage.local.set({ "websiteScores": websiteScores });
        });

    }).catch((error) => {
        throw (error)
    });
}