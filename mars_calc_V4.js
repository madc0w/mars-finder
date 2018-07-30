// JavaScript Document
// Copyright Emory Department of Physics, 2008.
// Code written by Scott Meves.
// Equations and calcuations applied by Horace Dale.
// VSOP87 converted from libnova-0.7.0 under GNU-GPL.
// Revised 01/04/08 J.Boss
// Revised 12/17/2011 H. Dale & J. Boss

function speed(start)
{
   finish = new Date();
   elapsed = finish - start;
   elapsed = elapsed / 1000;
   return elapsed;
}

function commaSplit(srcNumber)
{
   var txtNumber = '' + srcNumber;
   var rxSplit = new RegExp('([0-9])([0-9][0-9][0-9][,.])');
   var arrNumber = txtNumber.split('.');
   arrNumber[0] += '.';
   do
   {
      arrNumber[0] = arrNumber[0].replace(rxSplit, '$1,$2');
   }
   while (rxSplit.test(arrNumber[0]));
   if (arrNumber.length > 1)
   {
      return arrNumber.join('');
   }
   else
   {
      return arrNumber[0].split('.')[0];
   }
}

function calculateJD(cdDate)
{
   var year = cdDate.getUTCFullYear()
   var month = cdDate.getUTCMonth() + 1
   if (month < 3)
   {
      year = year - 1
      month = month + 12
   }
   var day = cdDate.getUTCDate()
   var hour = cdDate.getUTCHours()
   var min = cdDate.getUTCMinutes()
   var sec = cdDate.getUTCSeconds()

   var A = parseInt(year / 100)
   var B = 2 - A + parseInt(A / 4)

   var E = hour / 24 + min / 1440 + sec / (8.64 * Math.pow(10, 4))

   var jd = parseInt(365.25 * (year + 4716)) + parseInt(30.6001 * (month + 1)) + day + B - 1524.5 + E

   // correct for dynamical time
   // 2011 : 66.7 seconds. 66.7 / (24 * 3600) = .000771991

   // jd = jd + .000771991

   return jd;
}

function UTCdate(d)
{
   var weekday = new Array("Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat")
   var monthname = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec")
   utc = weekday[d.getUTCDay()] + " ";
   utc += monthname[d.getUTCMonth()] + " "
   utc += d.getUTCDate() + " "
   if (d.getUTCHours() < 10) utc += "0";
   utc += d.getUTCHours() + ":"
   if (d.getUTCMinutes() < 10) utc += "0";
   utc += d.getUTCMinutes() + ":"
   if (d.getUTCSeconds() < 10) utc += "0";
   utc += d.getUTCSeconds() + " UTC "
   utc += d.getUTCFullYear() + " "
   return utc;
}

function calc_series (array, t)
{

   value = 0;

   for (i = 0; i < array.length; i ++ )
   {
      value += array[i][0] * Math.cos(array[i][1] + array[i][2] * t)
   }

   return value;
}

function getEarthHelio(JD)
{
   t = (JD - 2451545.0) / 365250.0;
   t2 = t * t;
   t3 = t2 * t;
   t4 = t3 * t;
   t5 = t4 * t;

   L0 = calc_series(el0, t);
   L1 = calc_series(el1, t);
   L2 = calc_series(el2, t);
   L3 = calc_series(el3, t);
   L4 = calc_series(el4, t);
   L5 = calc_series(el5, t);
   L = (L0 + L1 * t + L2 * t2 + L3 * t3 + L4 * t4 + L5 * t5);

   B0 = calc_series(eb0, t);
   B1 = calc_series(eb1, t);
   B2 = calc_series(eb2, t);
   B3 = calc_series(eb3, t);
   B4 = calc_series(eb4, t);
   B5 = calc_series(eb5, t);
   B = (B0 + B1 * t + B2 * t2 + B3 * t3 + B4 * t4 + B5 * t5);

   R0 = calc_series(er0, t);
   R1 = calc_series(er1, t);
   R2 = calc_series(er2, t);
   R3 = calc_series(er3, t);
   R4 = calc_series(er4, t);
   R5 = calc_series(er5, t);
   R = (R0 + R1 * t + R2 * t2 + R3 * t3 + R4 * t4 + R5 * t5);

   E = new Array(3);
   E[0] = L;
   E[1] = B;
   E[2] = R;

   return E;
}

function getMarsHelio(JD)
{
   t = (JD - 2451545.0) / 365250.0;
   t2 = t * t;
   t3 = t2 * t;
   t4 = t3 * t;
   t5 = t4 * t;

   L0 = calc_series(ml0, t);
   L1 = calc_series(ml1, t);
   L2 = calc_series(ml2, t);
   L3 = calc_series(ml3, t);
   L4 = calc_series(ml4, t);
   L5 = calc_series(ml5, t);
   L = (L0 + L1 * t + L2 * t2 + L3 * t3 + L4 * t4 + L5 * t5);

   B0 = calc_series(mb0, t);
   B1 = calc_series(mb1, t);
   B2 = calc_series(mb2, t);
   B3 = calc_series(mb3, t);
   B4 = calc_series(mb4, t);
   B5 = calc_series(mb5, t);
   B = (B0 + B1 * t + B2 * t2 + B3 * t3 + B4 * t4 + B5 * t5);

   R0 = calc_series(mr0, t);
   R1 = calc_series(mr1, t);
   R2 = calc_series(mr2, t);
   R3 = calc_series(mr3, t);
   R4 = calc_series(mr4, t);
   R5 = calc_series(mr5, t);
   R = (R0 + R1 * t + R2 * t2 + R3 * t3 + R4 * t4 + R5 * t5);

   M = new Array(3);
   M[0] = L;
   M[1] = B;
   M[2] = R;

   return M;
}

function calcDistance(el, eb, er, ml, mb, mr)
{
   x = mr * Math.cos(mb) * Math.cos(ml) - er * Math.cos(el) * Math.cos(eb);
   y = mr * Math.cos(mb) * Math.sin(ml) - er * Math.sin(el) * Math.cos(eb);
   z = mr * Math.sin(mb) - er * Math.sin(eb);

   // Correction for Barycenter

   Q = 3.8048177 + (8399.711184 * t);
   u = x - (Math.cos(Q) * 0.0000312);
   v = y - (Math.sin(Q) * 0.0000286);
   w = z - (Math.sin(Q) * 0.0000124);


   distance = Math.sqrt(Math.pow(u, 2) + Math.pow(v, 2) + Math.pow(w, 2));
   // distance = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2));


   return distance;
}

function lightTime(d)
{
   lt = d * .0057755183;
   // in days
   return lt;
}

function round_num(x, places)
{
   return (Math.round(x * Math.pow(10, places))) / Math.pow(10, places)
}
