float temp;
int voltage = 5;

float readTemp() {
  float tempRead = analogRead(0);
  tempRead = tempRead * voltage / 1024.0;
  tempRead = tempRead - 0.5;
  tempRead = tempRead / 0.01;
  return tempRead;
}

void setup() {
  Serial.begin(9600);
}

void loop() {
  temp = readTemp();
  Serial.println(temp);
  delay(1000);
}