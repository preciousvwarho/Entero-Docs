import React, {useState, useEffect, useContext} from 'react';
import { Image, Offcanvas} from 'react-bootstrap';
import BGImage from "../../assets/img/fountain.png";
import configData from "../../../config.json";
import { useHistory } from "react-router-dom";
import { Context } from '../../../Store';

const Fountain = (props) => {
    const history = useHistory();
    const {estate} = props;
    const [showOffcanvas, setShowOffcanvas] = useState(false);
    const [data, setData] = useState([]);
    const [properties, setProperties] = useState([])
    const [state] = useContext(Context);
  
    const offCanvasClose = () => setShowOffcanvas(false);
    const offCanvasShow = () => setShowOffcanvas(true);

    const getEstPlots = async() => {

        try {

            return fetch(`${configData.TEST_URL}/plot/estate/plots/${estate._id}`, {
                method: "get",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                  // "x-auth-token":  window.localStorage.getItem("token")
                },
              })
                .then((response) => response.json())
                .then((responseJson) => {
                    console.log(responseJson.data);
                    setProperties(responseJson.data);
                })
                .catch((error) => {
                  console.error(error);
                });
        
            } catch (error) {
                 console.log(error);
            }
    
    }
   const  svgPaths = [
        { id: "efh-102", d: "M1455 2719L1356.5 2743.5L1404.5 2932L1503 2907.5L1455 2719Z" },
        { id: "efh-101", d: "M1486.5 2710L1457.5 2718.5L1506 2906.5L1599.5 2883L1594 2737L1492 2728.5L1486.5 2710Z" },

        { id: "efh-103", d: "M1354.5 2744.5L1256.5 2769.5L1303.5 2958.5L1403 2933L1354.5 2744.5Z" },

        { id: "efh-104", d: "M1253 2770.5L1155.5 2795L1204 2983L1302 2959L1253 2770.5Z" },

        { id: "efh-105", d: "M1153.5 2795.5L1054.5 2821L1103 3009L1201.5 2984L1153.5 2795.5Z" },

        { id: "efh-106", d: "M1053 2821.5L946.5 2849L1011 3033L1101 3009.5L1053 2821.5Z" },

        { id: "efh-95", d: "M1126.5 2531.5L1028.5 2557L1077.5 2750L1176 2725L1126.5 2531.5Z" },

        { id: "efh-94", d: "M1026.5 2558L917.5 2585.5L976.5 2755L1003 2769L1075.5 2750.5L1026.5 2558Z" },

        { id: "efh-100", d: "M1608.5 2545L1497.5 2559.5L1478.5 2649L1493 2726L1594 2733.5L1597 2639.5L1608.5 2545Z" },

        { id: "efh-82", d: "M1245.5 2370L1089 2424.5L1116 2531.5L1295.5 2486L1279 2423.5L1262 2416L1245.5 2370Z" },

        { id: "efh-93", d: "M1086.5 2426L886 2497L916.5 2583L1113.5 2532.5L1086.5 2426Z" },

        { id: "efh-98", d: "M1442 2451.5L1330 2480L1379 2673L1430.5 2660L1450.5 2641L1464 2539L1442 2451.5Z" },
        { id: "efh-92", d: "M1028.5 2331L850 2394.5L885 2494.5L1063.5 2431L1028.5 2331Z" },

        { id: "efh-83", d: "M1209.5 2266.5L1030.5 2330L1066 2429.5L1245 2367L1209.5 2266.5Z" },

        { id: "efh-87", d: "M1045 1860.5L884.5 1917.5L920.5 2019.5L1099.5 1956L1070 1872.5L1045 1860.5Z" },

        { id: "efh-88", d: "M721.5 1975L710 1999L739.5 2083L918.5 2020L883 1918L721.5 1975Z" },
        { id: "efh-86", d: "M1100.5 1958L922 2021.5L957 2122.5L1136.5 2058.5L1100.5 1958Z" },

        { id: "efh-89", d: "M919.5 2022L740.5 2085L775.5 2186.5L955 2122.5L919.5 2022Z" },

        { id: "efh-85", d: "M1136.5 2061L958 2124L993.5 2224.5L1172 2161L1136.5 2061Z" },

        { id: "efh-90", d: "M955.5 2125L776.5 2188L812.5 2288.5L991 2225.5L955.5 2125Z" },

        { id: "efh-84", d: "M1173 2164L994 2227.5L1030 2327.5L1208.5 2264L1173 2164Z" },
        { id: "efh-91", d: "M992 2228L813.5 2291.5L849 2392L1027.5 2328L992 2228Z" },

        { id: "efh-75", d: "M1426.5 1725.5L1291.5 1773.5L1331 1884L1434 1847.5L1509.5 1782L1463 1728.5L1426.5 1725.5Z" },

        { id: "efh-74", d: "M1433.5 1851L1331.5 1887L1383 2032.5L1508 1978L1446 1882L1531.5 1807.5L1511.5 1784L1433.5 1851Z" },
        { id: "efh-72", d: "M1648.5 1943.5L1536 2017L1620 2146L1721.5 2057L1723.5 2029L1648.5 1943.5Z" },
        { id: "efh-71", d: "M1509 1980.5L1383 2035L1423 2145L1550 2100L1596 2167L1618.5 2147.5L1509 1980.5Z" },
        { id: "efh-70", d: "M1549.5 2105L1424.5 2149L1473.5 2286.5L1589 2245L1593.5 2169.5L1549.5 2105Z" },
        { id: "efh-69", d: "M1588.5 2248.5L1474 2289.5L1523 2429L1619 2405L1630.5 2250L1588.5 2248.5Z" },
        { id: "efh-76", d: "M1140.5 1827L1129.5 1851.5L1162 1944L1328 1885L1289.5 1774.5L1140.5 1827Z" },
        { id: "efh-77", d: "M1328.5 1887.5L1162.5 1946L1201 2054.5L1367.5 1996L1328.5 1887.5Z" },
        { id: "efh-78", d: "M1368 1998L1201.5 2056.5L1240 2165L1406.5 2106L1368 1998Z" },
        { id: "efh-79", d: "M1407 2109L1241 2167.5L1279.5 2275.5L1445.5 2216.5L1407 2109Z" },
        { id: "efh-80", d: "M1446 2220.5L1280 2278.5L1318.5 2387L1484.5 2328L1446 2220.5Z" },
        { id: "efh-81", d: "M1317.5 2389L1281.5 2423L1297.5 2485.5L1520.5 2428.5L1485 2330L1317.5 2389Z" },
        { id: "efh-99", d: "M1618 2407L1444 2451L1467 2540L1452.5 2641.5L1476.5 2648L1495.5 2557.5L1609 2542L1618 2407Z" },
        { id: "efh-97", d: "M1328 2480.5L1229.5 2506L1278.5 2698.5L1376.5 2673.5L1328 2480.5Z" },
        { id: "efh-96", d: "M1227 2506L1129.5 2531H1128L1177.5 2724.5L1277 2699.5L1227 2506Z" },
        { id: "efh-73", d: "M1533 1809.5L1449 1882L1535 2014.5L1647 1940.5L1533 1809.5Z" },
        { id: "efh-61", d: "M1715 1692L1552 1589L1521.5 1642.5L1524.5 1671L1642.5 1808L1715 1692Z" },
        { id: "efh-62", d: "M1717.5 1694.5L1644.5 1810.5L1733 1911L1827 1763.5L1717.5 1694.5Z" },
        { id: "efh-63", d: "M1829 1762.5L1734 1915.97L1782 1972H1810.5L1882 1900.82L1919 1817.02L1829 1762.5Z" },
        { id: "efh-59", d: "M1678 1376.5L1577.5 1546L1666.5 1601L1767.5 1429.5L1678 1376.5Z" },
        { id: "efh-65", d: "M1953 1539L1850.5 1711.5L1944 1771L2032 1585.5L1953 1539Z" },
        { id: "efh-64", d: "M1736.5 1704.5L1736.88 1703.79M1736.88 1703.79L1808 1569.5L1899.5 1625L1848 1713L1943 1772L1921 1819.5L1736.88 1703.79Z" },
        { id: "efh-29", d: "M1075 1066.5L1019.5 1158.5L1158.5 1241.5L1219.5 1219.5L1248 1196.5L1259.5 1176L1075 1066.5Z" },
        { id: "efh-28", d: "M981 1136L915.5 1157.5L960 1290.5L984.5 1303L1159 1241L981 1136Z" },
        { id: "efh-33", d: "M1448.5 975.5L1416 1030.5L1562 1118L1619.5 1020L1447 918.5L1429 949L1444.5 959L1448.5 975.5Z" },
        { id: "efh-55", d: "M1620 1020.5L1562.5 1117.5L1708 1203.5L1741.5 1150L1759 1145.5L1773 1154L1791.5 1122.5L1620 1020.5Z" },
        { id: "efh-34", d: "M1416 1030.5L1353 1138L1499 1224L1562.5 1117.5L1416 1030.5Z" },
        { id: "efh-54", d: "M1562.5 1117.5L1499 1223.5L1645.5 1310.5L1708 1203.5L1562.5 1117.5Z" },
        { id: "efh-35", d: "M1353 1137L1290 1243.5L1436 1330L1499.5 1224.5L1353 1137Z" },
        { id: "efh-53", d: "M1499 1224L1436 1330.5L1582 1417L1645.5 1310.5L1499 1224Z" },
        { id: "efh-36", d: "M1290 1243.5L1250.5 1273L1318 1463.5L1372.5 1437L1436 1330.5L1290 1243.5Z" },
        { id: "efh-37", d: "M1251 1273L1152.5 1308L1219.5 1498.5L1317.5 1463L1251 1273Z" },
        { id: "efh-51", d: "M1318 1463L1220 1497.5L1252.5 1589.5L1441 1523L1497.5 1557.5L1518.5 1523L1373 1436.5L1318 1463Z" },
        { id: "efh-50", d: "M1440.5 1524L1253 1590L1287 1687.5L1438 1635L1467.5 1610L1498.5 1558L1440.5 1524Z" },
        { id: "efh-38", d: "M1152.5 1308L1054.5 1342.5L1122.5 1532L1220 1497.5L1152.5 1308Z" },
        { id: "efh-49", d: "M1220 1497.5L1122 1532.5L1188.5 1721.5L1287 1686.5L1220 1497.5Z" },
        { id: "efh-39", d: "M956.5 1377L957.149 1376.77M957.149 1376.77L1054.5 1342L1121.5 1531.5L1024.5 1566.5L957.149 1376.77Z" },
        { id: "efh-48", d: "M1121 1532.5L1024 1567L1090.5 1756L1188 1721.5L1121 1532.5Z" },
        { id: "efh-40", d: "M956.5 1377.5L859 1411L926.5 1600.5L1022.5 1566.5L956.5 1377.5Z" },
        { id: "efh-47", d: "M1024 1567.5L926 1602L992.5 1792.5L1091 1756.5L1024 1567.5Z" },
        { id: "efh-41", d: "M859 1411.5L761 1446.5L828 1636L926.5 1601.5L859 1411.5Z" },
        { id: "efh-46", d: "M926 1602L828.5 1636L895 1825.5L992.5 1791L926 1602Z" },
        { id: "efh-42", d: "M761 1447L664 1481L731.5 1669.5L827 1636L761 1447Z" },
        { id: "efh-45", d: "M827.5 1637.5L731 1671.5L798 1860L894.5 1825.5L827.5 1637.5Z" },
        { id: "efh-43", d: "M662.5 1482L585.5 1509.5L573 1533L632 1706.5L730.5 1671L662.5 1482Z" },
        { id: "efh-44", d: "M729 1671.5L631.5 1707.5L690 1878L716 1889L796 1859.5L729 1671.5Z" },
        { id: "efh-56", d: "M1793 1182L1759.5 1238.5L1899 1320L1957.5 1221L1793 1123.5L1775 1153.5L1789 1163L1793 1182Z" },
        { id: "efh-68", d: "M1959.5 1222L1901 1321.5L2099 1439L2110 1408.5L2047 1371L2089 1299L1959.5 1222Z" },
        { id: "efh-57", d: "M1758 1240L1706.5 1328.5L1880.5 1432L1927.5 1339.5L1758 1240Z" },
        { id: "efh-67", d: "M1929 1340.5L1882 1432.5L2057 1537L2097 1440L1929 1340.5Z" },
        { id: "efh-58", d: "M1770.5 1429.5L1721 1514L1808 1567.5L1879 1433.5L1705 1330.5L1679 1374.5L1770.5 1429.5Z" },
        { id: "efh-66", d: "M1880.5 1434.5L1809 1568.5L1900.5 1623.5L1952.5 1536L2034 1584.5L2056 1538L1880.5 1434.5Z" },
        { id: "efh-52", d: "M1436 1331L1373 1437L1519 1524L1582 1417L1436 1331Z" },
        { id: "efh-30", d: "M1147 984.5L1092.5 1076L1259.5 1175.5L1314.5 1083L1147 984.5Z" },
        { id: "efh-27", d: "M887 1074L915.5 1157.5L981.5 1136L1019.5 1159L1075 1066L924.5 977.5L890 1035.5L887 1074Z" },
        { id: "efh-26", d: "M979.5 885L925 978L1092 1076.5L1147 984L979.5 885Z" },
        { id: "efh-24", d: "M1087 705L1036.5 792L1201.5 889.5L1253 803L1087 705Z" },
        { id: "efh-32", d: "M1255.5 804.5L1203.5 892.5L1369 990.5L1397 945.5L1416 941.5L1428.5 949L1448 918.5L1255.5 804.5Z" },
        { id: "efh-25", d: "M1033.5 793.5L980 884.5L1147.5 984L1201.5 893L1033.5 793.5Z" },
        { id: "efh-31", d: "M1202 891.5L1147 984L1315 1083.5L1369 990.5L1202 891.5Z" },
        { id: "efh-17", d: "M855.5 1176.5L734.5 1217.5L786.5 1371.5L890 1334.5L901.5 1310.5L855.5 1176.5Z" },
        { id: "efh-18", d: "M812 1078.5L639 1134L674 1237.5L855.5 1176.5L824.5 1084.5L812 1078.5Z" },
        { id: "efh-19", d: "M810 1049L646 952.5L604 1029.5L638.5 1134L812 1078L810 1049Z" },
        { id: "efh-20", d: "M701.5 859L646 952.5L810 1049L865.5 956L701.5 859Z" },
        { id: "efh-21", d: "M757 764.5L702 859L865.5 956L921 861.5L757 764.5Z" },
        { id: "efh-22", d: "M836 670L774 774.5L921 862L982.5 757L836 670Z" },
        { id: "efh-23", d: "M885.5 585.5L836 670L982.5 757L1003 724.5L1022.5 720.5L1062.5 744L1086.5 703.5L885.5 585.5Z" },
        { id: "efh-16", d: "M734.5 1217.5L615 1258.5H613.5L666.5 1414.5L785.5 1371L734.5 1217.5Z" },
        { id: "efh-15", d: "M613.5 1258L495 1298L542 1437.5L566.5 1449L666.5 1414L613.5 1258Z" },
        { id: "efh-14", d: "M639 1133.5L459.5 1194.5L494.5 1298.5L673.5 1237.5L639 1133.5Z" },
        { id: "efh-12", d: "M481.5 854.5L449.5 908.5L466 919L513.5 1060L603.5 1029L646.5 952.5L481.5 854.5Z" },
        { id: "efh-13", d: "M603 1029.5L424.5 1090.5L459.5 1194.5L639 1133.5L603 1029.5Z" },
        { id: "efh-11", d: "M537.5 761L482 855.5L646 952.5L701.5 858.5L537.5 761Z" },
        { id: "efh-09", d: "M830 678.5L671 583.5L610 677L773.5 774L830 678.5Z" },
        { id: "efh-06", d: "M510.5 608L378.5 530L315.5 635.5L464.5 724L517.5 637L510.5 608Z" },
        { id: "efh-08", d: "M886.5 584.5L730.5 492.5L671 584.5L830.5 678.5L886.5 584.5Z" },
        { id: "efh-04", d: "M271 537.5L302.5 484L189 417L184.5 400L200.5 374.5L163 351.5L115 429L164 574L271 537.5Z" },
        { id: "efh-05", d: "M199.5 678.5L164 574L270.5 538L302.5 484L378 529L316 634.5L199.5 678.5Z" },
        { id: "efh-07", d: "M199 679L316 634.5L464.5 723L447 751.5L407 728L235.5 785L199 679Z" },
        { id: "efh-01", d: "M579 403L467 337L387.5 471L498.5 537L579 403Z" },
        { id: "efh-02", d: "M467 336.5L355.5 270.5L275.5 404.5L387.5 470.5L467 336.5Z" },
        { id: "efh-03", d: "M355.5 270.5L252 209.5H250.5L164 351L200.5 374L217.5 370L276 404.5L355.5 270.5Z" },
        { id: "efh-10", d: "M586.5 677L538 761L701.5 858.5L758 765L610.5 678L586.5 677Z" },
        { id: "efh-60", d: "M1576.5 1547.5L1551.5 1589.5L1735.5 1703L1806.5 1568.5L1719.5 1515.5L1667 1604L1576.5 1547.5Z" },
    ]
    // state.profile.role === 'admin'
    useEffect(()=> {
        getEstPlots()
    },[])

    properties.forEach((property) => {
        const element = document.getElementById(`plot-${property.plotNumber}`);
        if(element) {
            if (property.status === 'sold') {
                element.style.fill = 'rgb(11, 153, 103, 0.4)';
                } 
            if (property.status === 'reserved') {
                element.style.fill = 'rgb(251, 97, 7, 0.4)';
                } 
            // else {
            //     element.style.fill = 'rgba(255, 255, 255, 0.2)';
            //   }
        }
    
    })

    const getPlotData = (id) => {
        console.log(id);
        
       const selectedPlot = properties.find((property) => `plot-${property.plotNumber}` === id)
       if(selectedPlot) {
          setData(selectedPlot)
          offCanvasShow()
          console.log(selectedPlot)
       }
    }

    const navigation = (data) => {
        history.push({
          pathname: `/Client-Details/${data?._id}`,
          state: { data: data },
        });
    }
  
    return (
        <>


                  <div  style={{background: `url(${BGImage})`, backgroundSize:"cover", width:"100%"}}  className="layout">
                  <svg width="2306" height="3158" viewBox="0 0 2306 3158" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g id="Group 1">
                    <path  fill='rgba(255, 255, 255, 0.2)'  onClick={()=> getPlotData('plot-102')}  id="plot-102" d="M1455 2719L1356.5 2743.5L1404.5 2932L1503 2907.5L1455 2719Z" stroke="black"/>
                    <path  fill='rgba(255, 255, 255, 0.2)'  onClick={()=> getPlotData('plot-101')}  id="plot-101" d="M1486.5 2710L1457.5 2718.5L1506 2906.5L1599.5 2883L1594 2737L1492 2728.5L1486.5 2710Z" stroke="black"/>

                    <path  fill='rgba(255, 255, 255, 0.2)'  onClick={()=> getPlotData('plot-103')}  id="plot-103" d="M1354.5 2744.5L1256.5 2769.5L1303.5 2958.5L1403 2933L1354.5 2744.5Z" stroke="black"/>

                    <path  fill='rgba(255, 255, 255, 0.2)'  onClick={()=> getPlotData('plot-104')}  id="plot-104" d="M1253 2770.5L1155.5 2795L1204 2983L1302 2959L1253 2770.5Z" stroke="black"/>

                    <path  fill='rgba(255, 255, 255, 0.2)'  onClick={()=> getPlotData('plot-105')}  id="plot-105" d="M1153.5 2795.5L1054.5 2821L1103 3009L1201.5 2984L1153.5 2795.5Z" stroke="black"/>

                    <path  fill='rgba(255, 255, 255, 0.2)'  onClick={()=> getPlotData('plot-106')}  id="plot-106" d="M1053 2821.5L946.5 2849L1011 3033L1101 3009.5L1053 2821.5Z" stroke="black"/>

                    <path  fill='rgba(255, 255, 255, 0.2)'  onClick={()=> getPlotData('plot-95')}  id="plot-95" d="M1126.5 2531.5L1028.5 2557L1077.5 2750L1176 2725L1126.5 2531.5Z" stroke="black"/>

                    <path  fill='rgba(255, 255, 255, 0.2)'  onClick={()=> getPlotData('plot-94')}  id="plot-94" d="M1026.5 2558L917.5 2585.5L976.5 2755L1003 2769L1075.5 2750.5L1026.5 2558Z" stroke="black"/>

                    <path  fill='rgba(255, 255, 255, 0.2)'  onClick={()=> getPlotData('plot-100')}  id="plot-100" d="M1608.5 2545L1497.5 2559.5L1478.5 2649L1493 2726L1594 2733.5L1597 2639.5L1608.5 2545Z" stroke="black"/>

                    <path  fill='rgba(255, 255, 255, 0.2)'  onClick={()=> getPlotData('plot-82')}  id="plot-82" d="M1245.5 2370L1089 2424.5L1116 2531.5L1295.5 2486L1279 2423.5L1262 2416L1245.5 2370Z" stroke="black"/>

                    <path  fill='rgba(255, 255, 255, 0.2)'  onClick={()=> getPlotData('plot-93')}  id="plot-93" d="M1086.5 2426L886 2497L916.5 2583L1113.5 2532.5L1086.5 2426Z" stroke="black"/>

                    <path  fill='rgba(255, 255, 255, 0.2)'  onClick={()=> getPlotData('plot-98')}  id="plot-98" d="M1442 2451.5L1330 2480L1379 2673L1430.5 2660L1450.5 2641L1464 2539L1442 2451.5Z" stroke="black"/>
                    <path  fill='rgba(255, 255, 255, 0.2)'  onClick={()=> getPlotData('plot-92')}  id="plot-92" d="M1028.5 2331L850 2394.5L885 2494.5L1063.5 2431L1028.5 2331Z" stroke="black"/>

                    <path  fill='rgba(255, 255, 255, 0.2)'  onClick={()=> getPlotData('plot-83')}  id="plot-83" d="M1209.5 2266.5L1030.5 2330L1066 2429.5L1245 2367L1209.5 2266.5Z" stroke="black"/>

                    <path  fill='rgba(255, 255, 255, 0.2)'  onClick={()=> getPlotData('plot-87')}  id="plot-87" d="M1045 1860.5L884.5 1917.5L920.5 2019.5L1099.5 1956L1070 1872.5L1045 1860.5Z" stroke="black"/>

                    <path  fill='rgba(255, 255, 255, 0.2)'  onClick={()=> getPlotData('plot-88')}  id="plot-88" d="M721.5 1975L710 1999L739.5 2083L918.5 2020L883 1918L721.5 1975Z" stroke="black"/>
                    <path  fill='rgba(255, 255, 255, 0.2)'  onClick={()=> getPlotData('plot-86')}  id="plot-86" d="M1100.5 1958L922 2021.5L957 2122.5L1136.5 2058.5L1100.5 1958Z" stroke="black"/>

                    <path  fill='rgba(255, 255, 255, 0.2)'  onClick={()=> getPlotData('plot-89')}  id="plot-89" d="M919.5 2022L740.5 2085L775.5 2186.5L955 2122.5L919.5 2022Z" stroke="black"/>

                    <path  fill='rgba(255, 255, 255, 0.2)'  onClick={()=> getPlotData('plot-85')}  id="plot-85" d="M1136.5 2061L958 2124L993.5 2224.5L1172 2161L1136.5 2061Z" stroke="black"/>

                    <path  fill='rgba(255, 255, 255, 0.2)'  onClick={()=> getPlotData('plot-90')}  id="plot-90" d="M955.5 2125L776.5 2188L812.5 2288.5L991 2225.5L955.5 2125Z" stroke="black"/>

                    <path  fill='rgba(255, 255, 255, 0.2)'  onClick={()=> getPlotData('plot-84')}  id="plot-84" d="M1173 2164L994 2227.5L1030 2327.5L1208.5 2264L1173 2164Z" stroke="black"/>
                    <path  fill='rgba(255, 255, 255, 0.2)'  onClick={()=> getPlotData('plot-91')}  id="plot-91" d="M992 2228L813.5 2291.5L849 2392L1027.5 2328L992 2228Z" stroke="black"/>

                    <path  fill='rgba(255, 255, 255, 0.2)'  onClick={()=> getPlotData('plot-75')}  id="plot-75" d="M1426.5 1725.5L1291.5 1773.5L1331 1884L1434 1847.5L1509.5 1782L1463 1728.5L1426.5 1725.5Z" stroke="black"/>

                    <path  fill='rgba(255, 255, 255, 0.2)'  onClick={()=> getPlotData('plot-74')}  id="plot-74" d="M1433.5 1851L1331.5 1887L1383 2032.5L1508 1978L1446 1882L1531.5 1807.5L1511.5 1784L1433.5 1851Z" stroke="black"/>
                    <path  fill='rgba(255, 255, 255, 0.2)'  onClick={()=> getPlotData('plot-72')}  id="plot-72" d="M1648.5 1943.5L1536 2017L1620 2146L1721.5 2057L1723.5 2029L1648.5 1943.5Z" stroke="black"/>
                    <path  fill='rgba(255, 255, 255, 0.2)'  onClick={()=> getPlotData('plot-71')}  id="plot-71" d="M1509 1980.5L1383 2035L1423 2145L1550 2100L1596 2167L1618.5 2147.5L1509 1980.5Z" stroke="black"/>
                    <path  fill='rgba(255, 255, 255, 0.2)'  onClick={()=> getPlotData('plot-70')}  id="plot-70" d="M1549.5 2105L1424.5 2149L1473.5 2286.5L1589 2245L1593.5 2169.5L1549.5 2105Z" stroke="black"/>
                    <path  fill='rgba(255, 255, 255, 0.2)'  onClick={()=> getPlotData('plot-69')}  id="plot-69" d="M1588.5 2248.5L1474 2289.5L1523 2429L1619 2405L1630.5 2250L1588.5 2248.5Z" stroke="black"/>
                    <path  fill='rgba(255, 255, 255, 0.2)'  onClick={()=> getPlotData('plot-76')}  id="plot-76" d="M1140.5 1827L1129.5 1851.5L1162 1944L1328 1885L1289.5 1774.5L1140.5 1827Z" stroke="black"/>
                    <path  fill='rgba(255, 255, 255, 0.2)'  onClick={()=> getPlotData('plot-77')}  id="plot-77" d="M1328.5 1887.5L1162.5 1946L1201 2054.5L1367.5 1996L1328.5 1887.5Z" stroke="black"/>
                    <path  fill='rgba(255, 255, 255, 0.2)'  onClick={()=> getPlotData('plot-78')}  id="plot-78" d="M1368 1998L1201.5 2056.5L1240 2165L1406.5 2106L1368 1998Z" stroke="black"/>
                    <path  fill='rgba(255, 255, 255, 0.2)'  onClick={()=> getPlotData('plot-79')}  id="plot-79" d="M1407 2109L1241 2167.5L1279.5 2275.5L1445.5 2216.5L1407 2109Z" stroke="black"/>
                    <path  fill='rgba(255, 255, 255, 0.2)'  onClick={()=> getPlotData('plot-80')}  id="plot-80" d="M1446 2220.5L1280 2278.5L1318.5 2387L1484.5 2328L1446 2220.5Z" stroke="black"/>
                    <path  fill='rgba(255, 255, 255, 0.2)'  onClick={()=> getPlotData('plot-81')}  id="plot-81" d="M1317.5 2389L1281.5 2423L1297.5 2485.5L1520.5 2428.5L1485 2330L1317.5 2389Z" stroke="black"/>
                    <path  fill='rgba(255, 255, 255, 0.2)'  onClick={()=> getPlotData('plot-99')}  id="plot-99" d="M1618 2407L1444 2451L1467 2540L1452.5 2641.5L1476.5 2648L1495.5 2557.5L1609 2542L1618 2407Z" stroke="black"/>
                    <path  fill='rgba(255, 255, 255, 0.2)'  onClick={()=> getPlotData('plot-97')}  id="plot-97" d="M1328 2480.5L1229.5 2506L1278.5 2698.5L1376.5 2673.5L1328 2480.5Z" stroke="black"/>
                    <path  fill='rgba(255, 255, 255, 0.2)'  onClick={()=> getPlotData('plot-96')}  id="plot-96" d="M1227 2506L1129.5 2531H1128L1177.5 2724.5L1277 2699.5L1227 2506Z" stroke="black"/>
                    <path  fill='rgba(255, 255, 255, 0.2)'  onClick={()=> getPlotData('plot-73')}  id="plot-73" d="M1533 1809.5L1449 1882L1535 2014.5L1647 1940.5L1533 1809.5Z" stroke="black"/>
                    <path  fill='rgba(255, 255, 255, 0.2)'  onClick={()=> getPlotData('plot-61')}  id="plot-61" d="M1715 1692L1552 1589L1521.5 1642.5L1524.5 1671L1642.5 1808L1715 1692Z" stroke="black"/>
                    <path  fill='rgba(255, 255, 255, 0.2)'  onClick={()=> getPlotData('plot-62')}  id="plot-62" d="M1717.5 1694.5L1644.5 1810.5L1733 1911L1827 1763.5L1717.5 1694.5Z" stroke="black"/>
                    <path  fill='rgba(255, 255, 255, 0.2)'  onClick={()=> getPlotData('plot-63')}  id="plot-63" d="M1829 1762.5L1734 1915.97L1782 1972H1810.5L1882 1900.82L1919 1817.02L1829 1762.5Z" stroke="black"/>
                    <path  fill='rgba(255, 255, 255, 0.2)'  onClick={()=> getPlotData('plot-59')}  id="plot-59" d="M1678 1376.5L1577.5 1546L1666.5 1601L1767.5 1429.5L1678 1376.5Z" stroke="black"/>
                    <path  fill='rgba(255, 255, 255, 0.2)'  onClick={()=> getPlotData('plot-65')}  id="plot-65" d="M1953 1539L1850.5 1711.5L1944 1771L2032 1585.5L1953 1539Z" stroke="black"/>
                    <path  fill='rgba(255, 255, 255, 0.2)'  onClick={()=> getPlotData('plot-64')}  id="plot-64" d="M1736.5 1704.5L1736.88 1703.79M1736.88 1703.79L1808 1569.5L1899.5 1625L1848 1713L1943 1772L1921 1819.5L1736.88 1703.79Z" stroke="black"/>
                    <path  fill='rgba(255, 255, 255, 0.2)'  onClick={()=> getPlotData('plot-29')}  id="plot-29" d="M1075 1066.5L1019.5 1158.5L1158.5 1241.5L1219.5 1219.5L1248 1196.5L1259.5 1176L1075 1066.5Z" stroke="black"/>
                    <path  fill='rgba(255, 255, 255, 0.2)'  onClick={()=> getPlotData('plot-28')}  id="plot-28" d="M981 1136L915.5 1157.5L960 1290.5L984.5 1303L1159 1241L981 1136Z" stroke="black"/>
                    <path  fill='rgba(255, 255, 255, 0.2)'  onClick={()=> getPlotData('plot-33')}  id="plot-33" d="M1448.5 975.5L1416 1030.5L1562 1118L1619.5 1020L1447 918.5L1429 949L1444.5 959L1448.5 975.5Z" stroke="black"/>
                    <path  fill='rgba(255, 255, 255, 0.2)'  onClick={()=> getPlotData('plot-55')}  id="plot-55" d="M1620 1020.5L1562.5 1117.5L1708 1203.5L1741.5 1150L1759 1145.5L1773 1154L1791.5 1122.5L1620 1020.5Z" stroke="black"/>
                    <path  fill='rgba(255, 255, 255, 0.2)'  onClick={()=> getPlotData('plot-34')}  id="plot-34" d="M1416 1030.5L1353 1138L1499 1224L1562.5 1117.5L1416 1030.5Z" stroke="black"/>
                    <path  fill='rgba(255, 255, 255, 0.2)'  onClick={()=> getPlotData('plot-54')}  id="plot-54" d="M1562.5 1117.5L1499 1223.5L1645.5 1310.5L1708 1203.5L1562.5 1117.5Z" stroke="black"/>
                    <path  fill='rgba(255, 255, 255, 0.2)'  onClick={()=> getPlotData('plot-35')}  id="plot-35" d="M1353 1137L1290 1243.5L1436 1330L1499.5 1224.5L1353 1137Z" stroke="black"/>
                    <path  fill='rgba(255, 255, 255, 0.2)'  onClick={()=> getPlotData('plot-53')}  id="plot-53" d="M1499 1224L1436 1330.5L1582 1417L1645.5 1310.5L1499 1224Z" stroke="black"/>
                    <path  fill='rgba(255, 255, 255, 0.2)'  onClick={()=> getPlotData('plot-36')}  id="plot-36" d="M1290 1243.5L1250.5 1273L1318 1463.5L1372.5 1437L1436 1330.5L1290 1243.5Z" stroke="black"/>
                    <path  fill='rgba(255, 255, 255, 0.2)'  onClick={()=> getPlotData('plot-37')}  id="plot-37" d="M1251 1273L1152.5 1308L1219.5 1498.5L1317.5 1463L1251 1273Z" stroke="black"/>
                    <path  fill='rgba(255, 255, 255, 0.2)'  onClick={()=> getPlotData('plot-51')}  id="plot-51" d="M1318 1463L1220 1497.5L1252.5 1589.5L1441 1523L1497.5 1557.5L1518.5 1523L1373 1436.5L1318 1463Z" stroke="black"/>
                    <path  fill='rgba(255, 255, 255, 0.2)'  onClick={()=> getPlotData('plot-50')}  id="plot-50" d="M1440.5 1524L1253 1590L1287 1687.5L1438 1635L1467.5 1610L1498.5 1558L1440.5 1524Z" stroke="black"/>
                    <path  fill='rgba(255, 255, 255, 0.2)'  onClick={()=> getPlotData('plot-38')}  id="plot-38" d="M1152.5 1308L1054.5 1342.5L1122.5 1532L1220 1497.5L1152.5 1308Z" stroke="black"/>
                    <path  fill='rgba(255, 255, 255, 0.2)'  onClick={()=> getPlotData('plot-49')}  id="plot-49" d="M1220 1497.5L1122 1532.5L1188.5 1721.5L1287 1686.5L1220 1497.5Z" stroke="black"/>
                    <path  fill='rgba(255, 255, 255, 0.2)'  onClick={()=> getPlotData('plot-39')}  id="plot-39" d="M956.5 1377L957.149 1376.77M957.149 1376.77L1054.5 1342L1121.5 1531.5L1024.5 1566.5L957.149 1376.77Z" stroke="black"/>
                    <path  fill='rgba(255, 255, 255, 0.2)'  onClick={()=> getPlotData('plot-48')}  id="plot-48" d="M1121 1532.5L1024 1567L1090.5 1756L1188 1721.5L1121 1532.5Z" stroke="black"/>
                    <path  fill='rgba(255, 255, 255, 0.2)'  onClick={()=> getPlotData('plot-40')}  id="plot-40" d="M956.5 1377.5L859 1411L926.5 1600.5L1022.5 1566.5L956.5 1377.5Z" stroke="black"/>
                    <path  fill='rgba(255, 255, 255, 0.2)'  onClick={()=> getPlotData('plot-47')}  id="plot-47" d="M1024 1567.5L926 1602L992.5 1792.5L1091 1756.5L1024 1567.5Z" stroke="black"/>
                    <path  fill='rgba(255, 255, 255, 0.2)'  onClick={()=> getPlotData('plot-41')}  id="plot-41" d="M859 1411.5L761 1446.5L828 1636L926.5 1601.5L859 1411.5Z" stroke="black"/>
                    <path  fill='rgba(255, 255, 255, 0.2)'  onClick={()=> getPlotData('plot-46')}  id="plot-46" d="M926 1602L828.5 1636L895 1825.5L992.5 1791L926 1602Z" stroke="black"/>
                    <path  fill='rgba(255, 255, 255, 0.2)'  onClick={()=> getPlotData('plot-42')}  id="plot-42" d="M761 1447L664 1481L731.5 1669.5L827 1636L761 1447Z" stroke="black"/>
                    <path  fill='rgba(255, 255, 255, 0.2)'  onClick={()=> getPlotData('plot-45')}  id="plot-45" d="M827.5 1637.5L731 1671.5L798 1860L894.5 1825.5L827.5 1637.5Z" stroke="black"/>
                    <path  fill='rgba(255, 255, 255, 0.2)'  onClick={()=> getPlotData('plot-43')}  id="plot-43" d="M662.5 1482L585.5 1509.5L573 1533L632 1706.5L730.5 1671L662.5 1482Z" stroke="black"/>
                    <path  fill='rgba(255, 255, 255, 0.2)'  onClick={()=> getPlotData('plot-')}  id="plot-44" d="M729 1671.5L631.5 1707.5L690 1878L716 1889L796 1859.5L729 1671.5Z" stroke="black"/>
                    <path  fill='rgba(255, 255, 255, 0.2)'  onClick={()=> getPlotData('plot-56')}  id="plot-56" d="M1793 1182L1759.5 1238.5L1899 1320L1957.5 1221L1793 1123.5L1775 1153.5L1789 1163L1793 1182Z" stroke="black"/>
                    <path  fill='rgba(255, 255, 255, 0.2)'  onClick={()=> getPlotData('plot-68')}  id="plot-68" d="M1959.5 1222L1901 1321.5L2099 1439L2110 1408.5L2047 1371L2089 1299L1959.5 1222Z" stroke="black"/>
                    <path  fill='rgba(255, 255, 255, 0.2)'  onClick={()=> getPlotData('plot-57')}  id="plot-57" d="M1758 1240L1706.5 1328.5L1880.5 1432L1927.5 1339.5L1758 1240Z" stroke="black"/>
                    <path  fill='rgba(255, 255, 255, 0.2)'  onClick={()=> getPlotData('plot-67')}  id="plot-67" d="M1929 1340.5L1882 1432.5L2057 1537L2097 1440L1929 1340.5Z" stroke="black"/>
                    <path  fill='rgba(255, 255, 255, 0.2)'  onClick={()=> getPlotData('plot-58')}  id="plot-58" d="M1770.5 1429.5L1721 1514L1808 1567.5L1879 1433.5L1705 1330.5L1679 1374.5L1770.5 1429.5Z" stroke="black"/>
                    <path  fill='rgba(255, 255, 255, 0.2)'  onClick={()=> getPlotData('plot-66')}  id="plot-66" d="M1880.5 1434.5L1809 1568.5L1900.5 1623.5L1952.5 1536L2034 1584.5L2056 1538L1880.5 1434.5Z" stroke="black"/>
                    <path  fill='rgba(255, 255, 255, 0.2)'  onClick={()=> getPlotData('plot-52')}  id="plot-52" d="M1436 1331L1373 1437L1519 1524L1582 1417L1436 1331Z" stroke="black"/>
                    <path  fill='rgba(255, 255, 255, 0.2)'  onClick={()=> getPlotData('plot-30')}  id="plot-30" d="M1147 984.5L1092.5 1076L1259.5 1175.5L1314.5 1083L1147 984.5Z" stroke="black"/>
                    <path  fill='rgba(255, 255, 255, 0.2)'  onClick={()=> getPlotData('plot-27')}  id="plot-27" d="M887 1074L915.5 1157.5L981.5 1136L1019.5 1159L1075 1066L924.5 977.5L890 1035.5L887 1074Z" stroke="black"/>
                    <path  fill='rgba(255, 255, 255, 0.2)'  onClick={()=> getPlotData('plot-26')}  id="plot-26" d="M979.5 885L925 978L1092 1076.5L1147 984L979.5 885Z" stroke="black"/>
                    <path  fill='rgba(255, 255, 255, 0.2)'  onClick={()=> getPlotData('plot-24')}  id="plot-24" d="M1087 705L1036.5 792L1201.5 889.5L1253 803L1087 705Z" stroke="black"/>
                    <path  fill='rgba(255, 255, 255, 0.2)'  onClick={()=> getPlotData('plot-32')}  id="plot-32" d="M1255.5 804.5L1203.5 892.5L1369 990.5L1397 945.5L1416 941.5L1428.5 949L1448 918.5L1255.5 804.5Z" stroke="black"/>
                    <path  fill='rgba(255, 255, 255, 0.2)'  onClick={()=> getPlotData('plot-25')}  id="plot-25" d="M1033.5 793.5L980 884.5L1147.5 984L1201.5 893L1033.5 793.5Z" stroke="black"/>
                    <path  fill='rgba(255, 255, 255, 0.2)'  onClick={()=> getPlotData('plot-31')}  id="plot-31" d="M1202 891.5L1147 984L1315 1083.5L1369 990.5L1202 891.5Z" stroke="black"/>
                    <path  fill='rgba(255, 255, 255, 0.2)'  onClick={()=> getPlotData('plot-17')}  id="plot-17" d="M855.5 1176.5L734.5 1217.5L786.5 1371.5L890 1334.5L901.5 1310.5L855.5 1176.5Z" stroke="black"/>
                    <path  fill='rgba(255, 255, 255, 0.2)'  onClick={()=> getPlotData('plot-18')}  id="plot-18" d="M812 1078.5L639 1134L674 1237.5L855.5 1176.5L824.5 1084.5L812 1078.5Z" stroke="black"/>
                    <path  fill='rgba(255, 255, 255, 0.2)'  onClick={()=> getPlotData('plot-19')}  id="plot-19" d="M810 1049L646 952.5L604 1029.5L638.5 1134L812 1078L810 1049Z" stroke="black"/>
                    <path  fill='rgba(255, 255, 255, 0.2)'  onClick={()=> getPlotData('plot-20')}  id="plot-20" d="M701.5 859L646 952.5L810 1049L865.5 956L701.5 859Z" stroke="black"/>
                    <path  fill='rgba(255, 255, 255, 0.2)'  onClick={()=> getPlotData('plot-21')}  id="plot-21" d="M757 764.5L702 859L865.5 956L921 861.5L757 764.5Z" stroke="black"/>
                    <path  fill='rgba(255, 255, 255, 0.2)'  onClick={()=> getPlotData('plot-22')}  id="plot-22" d="M836 670L774 774.5L921 862L982.5 757L836 670Z" stroke="black"/>
                    <path  fill='rgba(255, 255, 255, 0.2)'  onClick={()=> getPlotData('plot-23')}  id="plot-23" d="M885.5 585.5L836 670L982.5 757L1003 724.5L1022.5 720.5L1062.5 744L1086.5 703.5L885.5 585.5Z" stroke="black"/>
                    <path  fill='rgba(255, 255, 255, 0.2)'  onClick={()=> getPlotData('plot-16')}  id="plot-16" d="M734.5 1217.5L615 1258.5H613.5L666.5 1414.5L785.5 1371L734.5 1217.5Z" stroke="black"/>
                    <path  fill='rgba(255, 255, 255, 0.2)'  onClick={()=> getPlotData('plot-15')}  id="plot-15" d="M613.5 1258L495 1298L542 1437.5L566.5 1449L666.5 1414L613.5 1258Z" stroke="black"/>
                    <path  fill='rgba(255, 255, 255, 0.2)'  onClick={()=> getPlotData('plot-14')}  id="plot-14" d="M639 1133.5L459.5 1194.5L494.5 1298.5L673.5 1237.5L639 1133.5Z" stroke="black"/>
                    <path  fill='rgba(255, 255, 255, 0.2)'  onClick={()=> getPlotData('plot-12')}  id="plot-12" d="M481.5 854.5L449.5 908.5L466 919L513.5 1060L603.5 1029L646.5 952.5L481.5 854.5Z" stroke="black"/>
                    <path  fill='rgba(255, 255, 255, 0.2)'  onClick={()=> getPlotData('plot-13')}  id="plot-13" d="M603 1029.5L424.5 1090.5L459.5 1194.5L639 1133.5L603 1029.5Z" stroke="black"/>
                    <path  fill='rgba(255, 255, 255, 0.2)'  onClick={()=> getPlotData('plot-11')}  id="plot-11" d="M537.5 761L482 855.5L646 952.5L701.5 858.5L537.5 761Z" stroke="black"/>
                    <path  fill='rgba(255, 255, 255, 0.2)'  onClick={()=> getPlotData('plot-09')}  id="plot-09" d="M830 678.5L671 583.5L610 677L773.5 774L830 678.5Z" stroke="black"/>
                    <path  fill='rgba(255, 255, 255, 0.2)'  onClick={()=> getPlotData('plot-06')}  id="plot-06" d="M510.5 608L378.5 530L315.5 635.5L464.5 724L517.5 637L510.5 608Z" stroke="black"/>
                    <path  fill='rgba(255, 255, 255, 0.2)'  onClick={()=> getPlotData('plot-08')}  id="plot-08" d="M886.5 584.5L730.5 492.5L671 584.5L830.5 678.5L886.5 584.5Z" stroke="black"/>
                    <path  fill='rgba(255, 255, 255, 0.2)'  onClick={()=> getPlotData('plot-04')}  id="plot-04" d="M271 537.5L302.5 484L189 417L184.5 400L200.5 374.5L163 351.5L115 429L164 574L271 537.5Z" stroke="black"/>
                    <path  fill='rgba(255, 255, 255, 0.2)'  onClick={()=> getPlotData('plot-05')}  id="plot-05" d="M199.5 678.5L164 574L270.5 538L302.5 484L378 529L316 634.5L199.5 678.5Z" stroke="black"/>
                    <path  fill='rgba(255, 255, 255, 0.2)'  onClick={()=> getPlotData('plot-07')}  id="plot-07" d="M199 679L316 634.5L464.5 723L447 751.5L407 728L235.5 785L199 679Z" stroke="black"/>
                    <path  fill='rgba(255, 255, 255, 0.2)'  onClick={()=> getPlotData('plot-01')}  id="plot-01" d="M579 403L467 337L387.5 471L498.5 537L579 403Z" stroke="black"/>
                    <path  fill='rgba(255, 255, 255, 0.2)'  onClick={()=> getPlotData('plot-02')}  id="plot-02" d="M467 336.5L355.5 270.5L275.5 404.5L387.5 470.5L467 336.5Z" stroke="black"/>
                    <path  fill='rgba(255, 255, 255, 0.2)'  onClick={()=> getPlotData('plot-03')}  id="plot-03" d="M355.5 270.5L252 209.5H250.5L164 351L200.5 374L217.5 370L276 404.5L355.5 270.5Z" stroke="black"/>
                    <path  fill='rgba(255, 255, 255, 0.2)'  onClick={()=> getPlotData('plot-10')}  id="plot-10" d="M586.5 677L538 761L701.5 858.5L758 765L610.5 678L586.5 677Z" stroke="black"/>
                    <path  fill='rgba(255, 255, 255, 0.2)'  onClick={()=> getPlotData('plot-60')}  id="plot-60" d="M1576.5 1547.5L1551.5 1589.5L1735.5 1703L1806.5 1568.5L1719.5 1515.5L1667 1604L1576.5 1547.5Z" stroke="black"/>
                    {/* <path  fill='rgba(255, 255, 255, 0.2)'  onClick={()=> getPlotData('plot-')}  id="Vector 3460" d="M23 553H1M1 553V1H429H2305V3157H1V553Z" stroke="black"/> */}
                    </g>
                  </svg>
                    

                            </div>




        <Offcanvas show={showOffcanvas} onHide={offCanvasClose} placement={'end'}>
                <Offcanvas.Body>

                    <div className="estateDetails">
                        <span>{estate.name}</span>
                        <span>{estate.location}</span>
                    </div>


                    <div className='userProfDisplay'>

                            <div className="profInfo">
                                        <h4>Property Details</h4>

                                        <div className="profInfoData">

                                            <div className="profData">
                                                <span>Name</span>
                                                <span>{estate.name}</span>
                                            </div>

                                            
                                            <div className="profData">
                                                <span>Plot Number</span>
                                                <span>{data.plotNumber}</span>
                                            </div>

                                            <div className="profData">
                                                <span>Sqm</span>
                                                <span>{data.size}m<sup>2</sup></span>
                                            </div>

                                            <div className="profData">
                                                <span>Status</span>
                                                <span className={data.status === 'sold' ? 'soldStatus' : (data.status === 'pending' ? 'pendingStatus' : 'availableStatus')}>{data.status === 'sold' ? 'sold' : (data.status === 'reserved' ? 'reserved' : 'available')}</span>
                                            </div>
                                        </div>
                                    </div>

                            <div className="profInfo">
                                {data.docId ? <>

                                    <h4>Owned By</h4>

                                    <div className="user-details">

                                        <Image crossorigin="anonymous" src={`${configData.TEXT_IMG}/${data.docId.clientId.passport}`} className="useDataImg3" alt="" />
                                        <div className="userDataName">
                                            <span>{data.docId.clientId.fullName}</span>
                                            <span>{data.docId.clientId.phoneNumber}</span>
                                        </div>
                                    </div>

                                    <div className="profInfoData">

                                        <div className="profData">
                                            <span>Full Name</span>
                                            <span>{data.docId.clientId.fullName}</span>
                                        </div>

                                        <div className="profData">
                                            <span>Phone Number</span>
                                            <span>{data.docId.clientId.phoneNumber}</span>
                                        </div>
                                        
                                        <div className="profData">
                                            <span>Sex</span>
                                            <span>{data.docId.clientId.sex}</span>
                                        </div>
                                        
                                        <div className="profData">
                                            <span>Email</span>
                                            <span>{data.docId.clientId.email}</span>
                                        </div>

                                        <div className="view-more" onClick={() => navigation(data.docId.clientId)}>
                                            <span>view more</span>
                                        </div>

                                        
                                    </div>

                                    </> : <> 
                                 <div className="">
                                    <span>This property does not have an owner</span>
                                 </div>
                                </>}
                            </div>

                        </div> 

                </Offcanvas.Body>
                        
                </Offcanvas>





            
        </>
    );
};

export default Fountain;