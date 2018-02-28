//getting DOM elements
var btnLogin = document.getElementById('btnLogin')
var btnCall = document.getElementById('btnCall')
var localUser = document.getElementById('localUser')
var remoteUser = document.getElementById('remoteUser')
var localVideo = document.getElementById('localVideo')
var remoteVideo = document.getElementById('remoteVideo')

//some useful variables
var ua = null
var session = null
var interop = new SdpInterop.InteropChrome()
var isChrome = window.chrome

//change this ip to your asterisk server
const domain = "10.182.106.16"

//button events

btnLogin.addEventListener('click', () => {
    // Create our JsSIP instance and run it:

    var socket = new JsSIP.WebSocketInterface('wss://' + domain + ':8089/ws')
    var configuration = {
        sockets: [socket],
        uri: 'sip:'+ localUser.value +'@' + domain,
        authorization_user: localUser.value,
        password: '123456'
    }

    ua = new JsSIP.UA(configuration)

    ua.start()

    ua.on('connected', function (e) {
        console.log('connected', e)
    })

    ua.on('disconnected', function (e) {
        console.log('disconnected', e)
    })

    ua.on('newRTCSession', function (e) {
        console.log('newRTCSession', e)

        session = e.session

        if(e.originator === 'remote') {
            session.answer()
        }

        session.on('sdp', (data) => {
            if(isChrome) {
                console.log('doing dark magic in chrome...')
                let desc = new RTCSessionDescription({
                    type: data.type,
                    sdp: data.sdp
                })
                if (data.originator === 'local') {
                    converted = interop.toUnifiedPlan(desc)
                } else {
                    converted = interop.toPlanB(desc)
                }
    
                data.sdp = converted.sdp
            }
        })

        session.on('ended', data => {
            localVideo.src = ''
            remoteVideo.src = ''
            remoteUser.style.display = 'inline'
            btnCall.style.display = 'inline'
            btnHangup.style.display = 'none'
        })

        session.on('confirmed', () => {
            stream = session.connection.getLocalStreams()[0]
            localVideo.srcObject = stream
            remoteUser.style.display = 'none'
            btnCall.style.display = 'none'
            btnHangup.style.display = 'inline'
        })

        session.connection.ontrack = evt => {
            remoteVideo.srcObject = evt.streams[0]
        }
    })

    ua.on('registered', function (e) {
        console.log('registered', e)
        
        localUser.style.display = 'none'
        btnLogin.style.display = 'none'
        showUser.innerText = 'Logged as: ' + localUser.value
        remoteUser.style.display = 'inline'
        btnCall.style.display = 'inline'
    })
    ua.on('unregistered', function (e) {
        console.log('unregistered', e)
    })
    ua.on('registrationFailed', function (e) {
        console.log('registrationFailed', e)
        showUser.innerText = 'Username is not valid'
    })
})

btnCall.addEventListener('click', () => {
    var options = {
        'mediaConstraints': {
            'audio': false,
            'video': true
        }
    }

    session = ua.call('sip:' + remoteUser.value + '@' + domain, options)
})

btnHangup.addEventListener('click', () => {
    session.terminate()
    session = null
})
