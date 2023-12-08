const stunServer = "stun2.1.google.com:19302";
let iceCandidate = undefined;
let thatGuysChannel = undefined;
const iceConfig = {
  iceServers: [{ urls: `stun:${stunServer}` }],
};

const peerConnection = new RTCPeerConnection(iceConfig, {
  optional: [{ RtpDataChannels: true }],
});

const channel = peerConnection.createDataChannel("channel1", {
  reliable: true,
});

channel.onmessage = (event) => {
  document.getElementById("messageFromOtherSide").innerText = event.data;
};
channel.onerror = console.log;
channel.onclose = console.log;
channel.onopen = (event) => {
  console.log(event, "chanel opened");
  channel.send("Chal GAYA");
};

peerConnection.ondatachannel = (event) => {
  console.log(event, "ondatachannel");
  thatGuysChannel = event.channel;
};

peerConnection.oniceconnectionstatechange = (event) => {
  console.log(event);
};

peerConnection.addEventListener("icecandidate", (event) => {
  if (event.candidate) {
    iceCandidate = event.candidate;
  }
  console.log(event, "icecandidate");
});
peerConnection.addEventListener("icegatheringstatechange", (event) => {
  if (peerConnection.iceGatheringState === "complete") {
    console.log(event, "icegatheringstatechange");
    console.log(
      { iceCandidate: JSON.stringify(iceCandidate) },
      "found iceCandidate"
    );
    document.getElementById("possibleIceCandidate").innerText =
      JSON.stringify(iceCandidate);
  }
});

peerConnection.onconnectionstatechange = (event) => {
  console.log(event);
  if (peerConnection.connectionState === "connected") {
    console.log("Peers Connected");
  }
  document.getElementById("peerStatus").innerText =
    peerConnection.connectionState;
};

peerConnection.onsignalingstatechange = (event) => {
  console.log(event);
};

peerConnection.onicecandidateerror = (event) => {
  console.log(event);
};

document.getElementById("createOffer").onclick = async (e) => {
  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  console.log({ offer: JSON.stringify(offer) }, "offer created");
  document.getElementById("createdOffer").innerText = JSON.stringify(offer);
  navigator.clipboard.writeText(JSON.stringify(offer));
};

document.getElementById("submitOffer").onclick = async (e) => {
  const offer = JSON.parse(document.getElementById("offerJson").value);
  peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);
  document.getElementById("createdAnswer").innerText = JSON.stringify(answer);
  console.log({ answer: JSON.stringify(answer) }, "offerSubmitted");
  navigator.clipboard.writeText(JSON.stringify(answer));
};

document.getElementById("submitIceCandidate").onclick = async (e) => {
  const candidate = JSON.parse(
    document.getElementById("iceCandidateJson").value
  );
  try {
    await peerConnection.addIceCandidate(candidate);
  } catch (e) {
    console.error("Error adding received ice candidate", e);
  }
};

document.getElementById("submitAnswer").onclick = async (e) => {
  const answer = JSON.parse(document.getElementById("answerJson").value);
  const remoteDesc = new RTCSessionDescription(answer);
  await peerConnection.setRemoteDescription(remoteDesc);
};

document.getElementById("sendMessage").onclick = async (e) => {
  const message = document.getElementById("message").value;
  thatGuysChannel.send(message);
};
