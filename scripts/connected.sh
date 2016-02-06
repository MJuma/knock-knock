echo "{ \"dhcp\":" > connected.json
awk '
    BEGIN { print " [ " }
    { 
        printf "%s{\"leaseEnds\": \"%s\", \"macAddr\": \"%s\", \"ipAddr\": \"%s\"}",
        separator, $1, $2, $3
        separator = ", "
    }
    END { print " ] " } 
' /tmp/dhcp.leases >> connected.json
echo ",\"arp\":" >> connected.json
awk '
    BEGIN { print " [ " }
    /IP/ {next}
    { 
        printf "%s{\"ipAddr\": \"%s\", \"macAddr\": \"%s\"}",
        separator, $1, $4
        separator = ", "
    }
    END { print " ] " } 
' /proc/net/arp >> connected.json
echo ",\"hosts\":" >> connected.json
awk '
    BEGIN { print " [ " }
    { 
        printf "%s{\"ipAddr\": \"%s\", \"hostname\": \"%s\"}",
        separator, $1, $2
        separator = ", "
    }
    END { print " ] " } 
' /etc/hosts >> connected.json
echo ",\"wlan0\":" >> connected.json
iw dev wlan0 station dump $1  | awk '
    BEGIN { print " [ " }
    /Station/ { 
        printf "%s{\"macAddr\": \"%s\"",
        separator, $2
        separator = ", "
    } 
    /inactive\ time/ { 
        printf "%s\"inactiveTime\": \"%s\"",
        separator, $3
        separator = ", "
    } 
    /signal:/ { 
        printf "%s\"signal\": \"%s\"",
        separator, $2
        separator = ", "
    } 
    /tx bitrate:/ {
        printf "%s\"tx\": \"%s\"",
        separator, $3
        separator = ", "
    }
    /rx bitrate:/ {
        printf "%s\"rx\": \"%s\"}",
        separator, $3
        separator = ", "
    }
    /rx/ {next} 
    /tx/ {next} 
    /signal avg/ {next} 
    /auth/ {next} 
    /preamble/ {next} 
    /WMM/ {next} 
    /MFP/ {next} 
    /TDLS/ {next} 
    END { print " ] " }
' >> connected.json
echo ",\"wlan1\":" >> connected.json
iw dev wlan1 station dump $1  | awk '
    BEGIN { print " [ " }
    /Station/ { 
        printf "%s{\"macAddr\": \"%s\"",
        separator, $2
        separator = ", "
    } 
    /inactive\ time/ { 
        printf "%s\"inactiveTime\": \"%s\"",
        separator, $3
        separator = ", "
    } 
    /signal:/ { 
        printf "%s\"signal\": \"%s\"",
        separator, $2
        separator = ", "
    } 
    /tx bitrate:/ {
        printf "%s\"tx\": \"%s\"",
        separator, $3
        separator = ", "
    }
    /rx bitrate:/ {
        printf "%s\"rx\": \"%s\"}",
        separator, $3
        separator = ", "
    }
    /rx/ {next} 
    /tx/ {next} 
    /signal avg/ {next} 
    /auth/ {next} 
    /preamble/ {next} 
    /WMM/ {next} 
    /MFP/ {next} 
    /TDLS/ {next} 
    END { print " ] " }
' >> connected.json
echo "}" >> connected.json
