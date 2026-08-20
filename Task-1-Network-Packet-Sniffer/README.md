# Network Packet Sniffer


A Python-based network packet sniffer built using Scapy to capture and analyze live network traffic.


## Objective


The objective of this project is to capture network packets, analyze their structure and content, and understand how data flows through a network.


## Technologies Used


- Python
- Scapy
- Npcap
- Visual Studio Code
- Windows


## Features


- Capture live network packets
- Display source IP address
- Display destination IP address
- Identify network protocols
- Display source and destination ports
- Analyze packet layers
- Display available payload data
- Display packet traffic statistics
- Identify TCP, UDP and ICMP traffic


## Project Structure


```text
NETWORK_PACKET_SNIFFER/
│
├── packet_sniffer.py
├── requirements.txt
└── README.md
Installation

Install the required dependency:

python -m pip install -r requirements.txt

Scapy version used:

scapy==2.7.0

Npcap is required on Windows for packet capturing.

How to Run

Open PowerShell in the project directory and run:

python packet_sniffer.py

The program will start capturing network traffic.

To stop the packet capture:

CTRL + C
Sample Output
========== PACKET ANALYSIS ==========
Source IP       : 192.168.31.150
Destination IP  : 16.144.194.30
Protocol        : TCP
Source Port     : 49272
Destination Port: 443
Layers          : Ether -> IP -> TCP
Payload         : No application payload
=====================================
Packet Structure

The program analyzes different layers present inside a network packet.

Example:

Ether -> IP -> TCP -> Raw

Another example:

Ether -> IP -> UDP -> DNS

The layers represent different parts of network communication, including Ethernet, IP addressing, transport protocols and available application data.

Protocols
TCP

TCP is a connection-oriented transport protocol. The program displays its source port, destination port and packet information.

UDP

UDP is a connectionless transport protocol. The program displays its source port, destination port and packet information.

ICMP

ICMP is commonly used for network diagnostic and control messages. The program identifies ICMP traffic and displays its IP information.

Payload Analysis

If a packet contains a Raw payload, the program attempts to display a readable representation of the data.

If no application payload is available, the program displays:

No application payload

Encrypted traffic may appear as unreadable characters because the application data is protected by encryption.

Packet Statistics

The program also maintains basic traffic statistics, including:

Total packets captured
Protocol distribution
Top source IP addresses
Top destination IP addresses
Security and Privacy

This tool should only be used on systems and networks where packet capture is authorized.

Captured network traffic may contain sensitive information, so the tool should be used responsibly for educational, testing and authorized network analysis purposes.

Conclusion

This project demonstrates how Python and Scapy can be used to capture and analyze network traffic.

It provides practical understanding of:

IP addresses
TCP and UDP protocols
Network ports
Packet layers
Payloads
Network traffic statistics

The project helps build a foundation for understanding network monitoring and cybersecurity.
