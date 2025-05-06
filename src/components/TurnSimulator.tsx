import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Volume2 } from 'lucide-react';
import { toast } from "sonner";

const ITALIAN_ALPHABET = "ABCDEFGHILMNOPQRSTUVZ".split('');
const ENGLISH_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');

const TurnSimulator: React.FC = () => {
  const [alphabetType, setAlphabetType] = useState<'italian' | 'english'>('italian');
  const [availableLetters, setAvailableLetters] = useState<string[]>(ITALIAN_ALPHABET);
  const [selectedLetter, setSelectedLetter] = useState<string>(ITALIAN_ALPHABET[0]);
  const [currentNumber, setCurrentNumber] = useState<number>(0);

  const playBeep = useCallback(() => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      if (!audioCtx) {
        console.warn("AudioContext non supportato.");
        return;
      }
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(660, audioCtx.currentTime); // Frequenza più acuta
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.15); // Durata leggermente maggiore
    } catch (error) {
      console.error("Errore durante la riproduzione del suono:", error);
      toast.error("Impossibile riprodurre il suono.");
    }
  }, []);

  const speakTurn = useCallback((letter: string, number: number) => {
    if ('speechSynthesis' in window) {
      const numStr = String(number).padStart(2, '0');
      const digits = numStr.split('').join(' '); // "0 1" for 01, "1 2" for 12
      const textToSpeak = `${letter} ${digits}`;
      
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = 'it-IT';
      utterance.pitch = 1.2; // Voce leggermente più acuta
      utterance.rate = 0.9; // Leggermente più lenta per chiarezza
      speechSynthesis.speak(utterance);
    } else {
      console.warn("Sintesi vocale non supportata.");
      toast.warning("La sintesi vocale non è supportata dal tuo browser.");
    }
  }, []);

  useEffect(() => {
    const newAlphabet = alphabetType === 'italian' ? ITALIAN_ALPHABET : ENGLISH_ALPHABET;
    setAvailableLetters(newAlphabet);
    if (!newAlphabet.includes(selectedLetter)) {
      setSelectedLetter(newAlphabet[0]);
    }
  }, [alphabetType, selectedLetter]);

  const handleNext = () => {
    let newNumber = currentNumber + 1;
    if (newNumber > 99) {
      newNumber = 0;
    }
    setCurrentNumber(newNumber);
    playBeep();
    speakTurn(selectedLetter, newNumber);
  };

  const handlePrevious = () => {
    let newNumber = currentNumber - 1;
    if (newNumber < 0) {
      newNumber = 99;
    }
    setCurrentNumber(newNumber);
    playBeep();
    speakTurn(selectedLetter, newNumber);
  };
  
  const handleAnnounceCurrent = () => {
    playBeep();
    speakTurn(selectedLetter, currentNumber);
  };

  const formattedNumber = String(currentNumber).padStart(2, '0');

  return (
    <Card className="w-full max-w-md shadow-2xl">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold">Simulatore Visore Turni</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="alphabet-type" className="block text-sm font-medium text-gray-700 mb-1">Tipo Alfabeto</label>
            <Select value={alphabetType} onValueChange={(value: 'italian' | 'english') => setAlphabetType(value)}>
              <SelectTrigger id="alphabet-type">
                <SelectValue placeholder="Seleziona tipo alfabeto" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="italian">Italiano</SelectItem>
                <SelectItem value="english">Inglese</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="letter-select" className="block text-sm font-medium text-gray-700 mb-1">Lettera</label>
            <Select value={selectedLetter} onValueChange={setSelectedLetter}>
              <SelectTrigger id="letter-select">
                <SelectValue placeholder="Seleziona lettera" />
              </SelectTrigger>
              <SelectContent>
                {availableLetters.map(letter => (
                  <SelectItem key={letter} value={letter}>{letter}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="text-center my-8 p-6 bg-primary text-primary-foreground rounded-lg shadow-inner">
          <span className="text-8xl md:text-9xl font-mono font-bold tracking-wider">
            {selectedLetter}{formattedNumber}
          </span>
        </div>

        <div className="flex justify-around items-center space-x-2">
          <Button onClick={handlePrevious} className="p-6 text-lg flex-1 bg-secondary hover:bg-secondary/80 text-secondary-foreground">
            <ChevronLeft className="h-8 w-8 mr-2" /> Indietro
          </Button>
          <Button onClick={handleAnnounceCurrent} variant="outline" className="p-4">
            <Volume2 className="h-8 w-8" />
          </Button>
          <Button onClick={handleNext} className="p-6 text-lg flex-1 bg-primary hover:bg-primary/80 text-primary-foreground">
            Avanti <ChevronRight className="h-8 w-8 ml-2" />
          </Button>
        </div>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground text-center block pt-4">
        <p>Audio e sintesi vocale richiedono il supporto del browser.</p>
      </CardFooter>
    </Card>
  );
};

export default TurnSimulator;