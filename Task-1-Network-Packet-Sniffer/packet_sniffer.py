from scapy.all import sniff, IP, TCP, UDP, ICMP, Raw
from collections import Counter

# Packet statistics
protocol_count = Counter()
source_count = Counter()
destination_count = Counter()

total_packets = 0


def analyze_packet(packet):

    global total_packets

    if IP not in packet:
        return

    total_packets += 1

    source_ip = packet[IP].src
    destination_ip = packet[IP].dst

    # ---------------- Protocol & Ports ----------------

    if TCP in packet:
        protocol = "TCP"
        source_port = packet[TCP].sport
        destination_port = packet[TCP].dport

    elif UDP in packet:
        protocol = "UDP"
        source_port = packet[UDP].sport
        destination_port = packet[UDP].dport

    elif ICMP in packet:
        protocol = "ICMP"
        source_port = "-"
        destination_port = "-"

    else:
        protocol = "OTHER"
        source_port = "-"
        destination_port = "-"

    # Update statistics
    protocol_count[protocol] += 1
    source_count[source_ip] += 1
    destination_count[destination_ip] += 1

    # ---------------- Packet Layers ----------------

    layers = []

    current_layer = packet

    while current_layer:
        layers.append(current_layer.__class__.__name__)
        current_layer = current_layer.payload

    # ---------------- Payload ----------------

    if Raw in packet:

        payload = packet[Raw].load

        try:
            payload_text = payload.decode(
                "utf-8",
                errors="replace"
            )
        except Exception:
            payload_text = str(payload)

        payload_text = payload_text[:100]

    else:
        payload_text = "No application payload"

    # ---------------- Display Packet ----------------

    print("\n========== PACKET ANALYSIS ==========")
    print(f"Source IP       : {source_ip}")
    print(f"Destination IP  : {destination_ip}")
    print(f"Protocol        : {protocol}")
    print(f"Source Port     : {source_port}")
    print(f"Destination Port: {destination_port}")
    print(f"Layers          : {' -> '.join(layers)}")
    print(f"Payload         : {payload_text}")
    print("=====================================")


def show_statistics():

    print("\n\n=====================================")
    print("        PACKET STATISTICS")
    print("=====================================")

    print(f"\nTotal Packets: {total_packets}")

    print("\nProtocol Distribution:")
    for protocol, count in protocol_count.items():
        print(f"  {protocol:<8}: {count}")

    print("\nTop Source IPs:")
    for ip, count in source_count.most_common(5):
        print(f"  {ip:<18}: {count}")

    print("\nTop Destination IPs:")
    for ip, count in destination_count.most_common(5):
        print(f"  {ip:<18}: {count}")

    print("\n=====================================")


print("=====================================")
print("       NETWORK PACKET SNIFFER")
print("=====================================")
print("Capturing network traffic...")
print("Press CTRL+C to stop.\n")


try:

    sniff(
        prn=analyze_packet,
        store=False
    )

except KeyboardInterrupt:

    print("\n\nStopping packet capture...")

    show_statistics()