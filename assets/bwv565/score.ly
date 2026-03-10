\version "2.22.2"
\header {
  title = "Toccata und Fuge d-Moll"
  subtitle = "BWV 565"
  composer = "J. S. Bach"
}
\score {
\new PianoStaff 
\with {
    instrumentName = "Orgel"
  } 
<<
\new Staff \relative { \clef treble \key d \minor \time 4/4 \tempo "Adagio" a''8\mordent\fermata r8 r2. }
\new Staff \relative { \clef treble \key d \minor \time 4/4 a'8\mordent\fermata r8 r2. }
\new Staff \relative { \clef bass \key d \minor \time 4/4 r1 }
>>
\layout { }
}