import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Unstable_Grid2";
import { Divider, Stack } from "@mui/material";
import PrayerCard from "./components/PrayerCard";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import axios from "axios";
import moment from "moment";
import LoadingPage from "./components/LoadingPage";

const MainHolder = () => {
  // arrays and funcs
  const cities = [
    { citynname: "Dakahlia" },
    { citynname: "Beheira" },
    { citynname: "Faiyum" },
    { citynname: "Gharbia" },
    { citynname: "Alexandria" },
    { citynname: "Ismailia" },
    { citynname: "Giza" },
    { citynname: "Monufia" },
    { citynname: "Minya" },
    { citynname: "Cairo" },
    { citynname: "Qalyubia" },
    { citynname: "Luxor" },
    { citynname: "Suez" },
    { citynname: "Aswan" },
    { citynname: "Asyut" },
    { citynname: "Damietta" },
    { citynname: "Matrouh" },
    { citynname: "Qena" },
    { citynname: "Sohag" },
    { citynname: "Red Sea" },
    { citynname: "New Valley" },
    { citynname: "Al Sharqia" },
    { citynname: "Beni Suef" },
    { citynname: "Port Said" },
    { citynname: "South Sinai" },
    { citynname: "Kafr el-Sheikh" },
  ];
  const prayers = [
    { prayer: "" },
    { prayer: "Fajr" },
    { prayer: "Dhuhr" },
    { prayer: "Asr" },
    { prayer: "Maghrib" },
    { prayer: "Isha" },
  ];

  //states
  const [timings, setTimings] = useState({
    Fajr: "",
    Dhuhr: "",
    Asr: "",
    Maghrib: "",
    Isha: "",
  });
  const [city, setCity] = useState("Cairo");
  const [cityDisplayer, setCityDisplayer] = useState("Cairo");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [cityChangedCheck, setCityChangedCheck] = useState(false);

  const [UpcomingPrayerIndex, setUpcomingPrayerIndex] = useState(0);
  const [timeTillSalat, setTimeTillSalat] = useState("");
  const [upcomingSalaBadge, setUpcomingSalaBadge] = useState("");

  const checkUpcomingSala = (timings) => {
    if (!timings) return 0;

    //* better way
    let momentNow = moment();

    let prayerindex = 0;

    if (
      momentNow.isAfter(moment(timings["Fajr"], "hh:mm")) &&
      momentNow.isBefore(moment(timings["Dhuhr"], "hh:mm"))
    ) {
      prayerindex = 2;
    } else if (
      momentNow.isAfter(moment(timings["Dhuhr"], "hh:mm")) &&
      momentNow.isBefore(moment(timings["Asr"], "hh:mm"))
    ) {
      prayerindex = 3;
    } else if (
      momentNow.isAfter(moment(timings["Asr"], "hh:mm")) &&
      momentNow.isBefore(moment(timings["Maghrib"], "hh:mm"))
    ) {
      prayerindex = 4;
    } else if (
      momentNow.isAfter(moment(timings["Maghrib"], "hh:mm")) &&
      momentNow.isBefore(moment(timings["Isha"], "hh:mm"))
    ) {
      prayerindex = 5;
    } else {
      prayerindex = 1;
    }

    const nextPrayerObject = prayers[prayerindex];
    setUpcomingSalaBadge(nextPrayerObject.prayer);
    const timeOfSala = timings[nextPrayerObject.prayer];
    const timeInObj = moment(timeOfSala, "hh:mm");

    let remaingTimeTillSala = moment(timeOfSala, "hh:mm").diff(momentNow);

    if (nextPrayerObject.prayer === "Fajr") {
      let nowToMidnight = moment("23:59:59", "hh:mm:ss").diff(momentNow);
      let MidnightToFajr = timeInObj.diff(moment("00:00", "hh:mm"));
      let timeTillFajr = MidnightToFajr + nowToMidnight;
      remaingTimeTillSala = timeTillFajr;
    }

    const duration = moment.duration(remaingTimeTillSala);

    setTimeTillSalat(
      `${duration.hours() < 10 ? "0" + duration.hours() : duration.hours()} : ${
        duration.minutes() < 10 ? "0" + duration.minutes() : duration.minutes()
      } : ${
        duration.seconds() < 10 ? "0" + duration.seconds() : duration.seconds()
      }`
    );

    return prayerindex;
  };

  // styling
  const dividerStyling = { borderColor: "whitesmoke", opacity: 0.2 };
  // changeEvent
  const handleChange = (event) => {
    setCity(event.target.value);
    setCityChangedCheck(true);
    setLoading(true);
  };

  useEffect(() => {
    const getPrayers = async () => {
      try {
        const response = await axios.get(
          `https://api.aladhan.com/v1/timingsByCity?city=${city}&country=EG&method=8`
        );
        await new Promise((res) => setTimeout(res, 1200));
        setLoading(false);
        setCityChangedCheck(false);
        setCityDisplayer(
          response.config.url.split("?")[1].split("&")[0].split("=")[1]
        );
         (response);
        setTimings(response.data.data.timings);
        const upcomingPrayerIndex = checkUpcomingSala(
          response.data.data.timings
        );

        setUpcomingPrayerIndex(upcomingPrayerIndex || 0);
      } catch (error) {
         (error);
      }
    };
    getPrayers();
  }, [cityChangedCheck]);

  useEffect(() => {
    setCityChangedCheck(true);

  }, []);

  useEffect(() => {
    let int = setInterval(() => {
      const time = moment();

      setDate(time.format("MMM Do YYYY | h:mm:ss"));
      checkUpcomingSala(timings);
    }, 1000);
    return () => clearInterval(int);
  }, [timings]);

  return (
    <>
      {loading && (<LoadingPage city={cityChangedCheck} />)}
          <Grid container marginBottom={"10px"}>
            <Grid
              xs={4}
              className="pray-info"
              marginLeft={"45px"}
              padding={"10px"}
            >
              <div className="time-and-city">
                <h2>{date}</h2>
                <h3>{loading ? "Cairo" : cityDisplayer}</h3>
              </div>
            </Grid>
            <Grid xs={6} className="pray-info" padding={"10px"} flexDirection={window.innerWidth <= 768 ? "column" : "row"}>
              <div className="time-and-city">
                <h2>
                  {`Remaining time till ${
                    prayers[UpcomingPrayerIndex].prayer 
                  }`}
                </h2>
                <h3>{timeTillSalat}</h3>
              </div>
            </Grid>
          </Grid>
          <Divider style={dividerStyling} />
          <Stack
            gap={"15px"}
            style={{ marginTop: "30px" }}
            direction={{ xs: "column", sm: "row" }}
            justifyContent={"space-between"}
            alignItems={"center"}
            flexWrap={"wrap"}
          >
            <PrayerCard
              image="https://wepik.com/api/image/ai/9a07baa7-b49b-4f6b-99fb-2d2b908800c2"
              prayername="Fajr"
              prayertiming={timings.Fajr}
              badge={upcomingSalaBadge}
            />
            <PrayerCard
              image="https://wepik.com/api/image/ai/9a07bb45-6a42-4145-b6aa-2470408a2921"
              prayername="Dhuhr"
              prayertiming={timings.Dhuhr}
              badge={upcomingSalaBadge}
            />
            <PrayerCard
              image="https://wepik.com/api/image/ai/9a07bb90-1edc-410f-a29a-d260a7751acf"
              prayername="Asr"
              prayertiming={timings.Asr}
              badge={upcomingSalaBadge}
            />
            <PrayerCard
              image="https://wepik.com/api/image/ai/9a07bbe3-4dd1-43b4-942e-1b2597d4e1b5"
              prayername="Maghrib"
              prayertiming={timings.Maghrib}
              badge={upcomingSalaBadge}
            />
            <PrayerCard
              image="https://wepik.com/api/image/ai/9a07bc25-1200-4873-8743-1c370e9eff4d"
              prayername="Isha"
              prayertiming={timings.Isha}
              badge={upcomingSalaBadge}
            />
          </Stack>
          <Stack
            style={{ marginTop: "20px" }}
            direction={"row"}
            justifyContent="center"
          >
            <FormControl
              style={{
                width: window.innerWidth <= 768 ? " 90%" : "15%",
                marginBottom:"20px"
              }}
            >
              <InputLabel id="demo-simple-select-label">city</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={""}
                label="city"
                onChange={handleChange}
              >
                {cities.map((name, i) => (
                  <MenuItem key={i} value={name.citynname}>
                    {name.citynname}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
      
    </>
  );
};

export default MainHolder;
