# Serverless WebRTC
This project demonstrates how WebRTC works and how you can connect 2 peers without any server. 

# How to Use
Open the intex.html in 2 seperate browsers. (preferably on 2 different machines)

1. Peer 1 - create offer and copy the offer JSON
2. Peer 2 - submit that offer you got in step 1. Now you will get a answer JSON
3. Peer 1 - submit that answer you got in step 2. Now you will see ICE candiates in both the peers
4. Copy ICE candiate from any one of the peer and submit it in another. Peer status should show connected. If it doesn't then use other peer's ice candidate to submit.
5. Once peers are connected, you can send message from one peer to another without any server.
