// Lightweight Arduino C++ Execution Engine for Browser Simulator

export type PinStateMap = { [pin: number]: boolean };
export type PinModeMap = { [pin: number]: 'INPUT' | 'OUTPUT' | 'INPUT_PULLUP' };

export interface EngineCallbacks {
  onPinChange: (pin: number, state: boolean) => void;
  onSerialOutput: (message: string) => void;
  onStateUpdate: (pins: PinStateMap) => void;
}

export class ArduinoEngine {
  private pinStates: PinStateMap = {};
  private pinModes: PinModeMap = {};
  private isRunning: boolean = false;
  private timerIds: number[] = [];
  private callbacks: EngineCallbacks;

  constructor(callbacks: EngineCallbacks) {
    this.callbacks = callbacks;
    // Default pin 13 to OUTPUT, all others 0-13 to default
    for (let p = 0; p <= 13; p++) {
      this.pinStates[p] = false;
      this.pinModes[p] = p === 13 ? 'OUTPUT' : 'INPUT';
    }
  }

  public setPinInput(pin: number, state: boolean) {
    this.pinStates[pin] = state;
    this.callbacks.onStateUpdate({ ...this.pinStates });
  }

  public getPinState(pin: number): boolean {
    return !!this.pinStates[pin];
  }

  public stop() {
    this.isRunning = false;
    this.timerIds.forEach((id) => window.clearTimeout(id));
    this.timerIds = [];
    // Reset output states
    for (let p = 0; p <= 13; p++) {
      this.pinStates[p] = false;
    }
    this.callbacks.onStateUpdate({ ...this.pinStates });
  }

  public runCode(code: string) {
    this.stop();
    this.isRunning = true;

    // Extract setup() body and loop() body
    const setupBody = this.extractBlock(code, 'setup');
    const loopBody = this.extractBlock(code, 'loop');

    // Execute setup once
    this.executeStatements(setupBody);

    // Schedule recursive loop execution
    if (loopBody.length > 0) {
      this.executeLoopStep(loopBody, 0);
    }
  }

  private extractBlock(code: string, fnName: string): string[] {
    const fnRegex = new RegExp(`void\\s+${fnName}\\s*\\(\\s*\\)\\s*\\{([\\s\\S]*?)\\}`, 'm');
    const match = code.match(fnRegex);
    if (!match) return [];
    return this.splitStatements(match[1]);
  }

  private splitStatements(codeBlock: string): string[] {
    const statements: string[] = [];
    let current = '';
    let braceDepth = 0;
    let inString = false;
    let stringChar = '';

    for (let i = 0; i < codeBlock.length; i++) {
      const char = codeBlock[i];

      if ((char === '"' || char === "'") && (i === 0 || codeBlock[i - 1] !== '\\')) {
        if (!inString) {
          inString = true;
          stringChar = char;
        } else if (stringChar === char) {
          inString = false;
        }
      }

      if (!inString) {
        if (char === '{') {
          braceDepth++;
        } else if (char === '}') {
          braceDepth--;
          current += char;
          if (braceDepth === 0) {
            const trimmed = current.trim();
            if (trimmed) statements.push(trimmed);
            current = '';
            continue;
          }
        } else if (char === ';' && braceDepth === 0) {
          const trimmed = current.trim();
          if (trimmed) statements.push(trimmed);
          current = '';
          continue;
        }
      }

      current += char;
    }

    const lastTrimmed = current.trim();
    if (lastTrimmed) statements.push(lastTrimmed);

    return statements
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.startsWith('//'));
  }

  private executeStatements(statements: string[]) {
    for (const stmt of statements) {
      if (!this.isRunning) break;
      this.parseAndExecute(stmt);
    }
  }

  private executeLoopStep(statements: string[], index: number) {
    if (!this.isRunning) return;

    if (index >= statements.length) {
      // Finished one loop cycle, schedule next cycle after short pause
      const timer = window.setTimeout(() => {
        if (this.isRunning) this.executeLoopStep(statements, 0);
      }, 50);
      this.timerIds.push(timer);
      return;
    }

    const stmt = statements[index];

    // Handle delay(ms)
    const delayMatch = stmt.match(/delay\s*\(\s*(\d+)\s*\)/);
    if (delayMatch) {
      const ms = Math.max(50, parseInt(delayMatch[1], 10));
      const timer = window.setTimeout(() => {
        if (this.isRunning) this.executeLoopStep(statements, index + 1);
      }, ms);
      this.timerIds.push(timer);
      return;
    }

    // Normal statement execution
    this.parseAndExecute(stmt);

    // Continue to next statement immediately
    window.setTimeout(() => {
      if (this.isRunning) this.executeLoopStep(statements, index + 1);
    }, 0);
  }

  private parseAndExecute(stmt: string) {
    const cleanStmt = stmt.trim();
    if (!cleanStmt) return;

    // Handle conditional: if (digitalRead(pin) == HIGH) { ... } else { ... }
    if (cleanStmt.startsWith('if')) {
      const firstParen = cleanStmt.indexOf('(');
      const lastParen = cleanStmt.indexOf(')');
      if (firstParen !== -1 && lastParen !== -1 && lastParen > firstParen) {
        const cond = cleanStmt.slice(firstParen + 1, lastParen);
        const rest = cleanStmt.slice(lastParen + 1).trim();

        let isTrue = false;
        const dReadMatch = cond.match(/digitalRead\s*\(\s*(\d+)\s*\)/);
        if (dReadMatch) {
          const pinNum = parseInt(dReadMatch[1], 10);
          const pinVal = !!this.pinStates[pinNum];
          if (cond.includes('LOW') || cond.includes('== 0') || cond.includes('== false')) {
            isTrue = !pinVal;
          } else {
            isTrue = pinVal;
          }
        }

        // Separate then and else branches
        let thenCode = '';
        let elseCode = '';
        const elseIdx = rest.indexOf('else');
        if (elseIdx !== -1) {
          thenCode = rest.slice(0, elseIdx).trim();
          elseCode = rest.slice(elseIdx + 4).trim();
        } else {
          thenCode = rest;
        }

        if (isTrue && thenCode) {
          const innerCode = thenCode.replace(/^\{|\}$/g, '').trim();
          this.executeStatements(this.splitStatements(innerCode));
        } else if (!isTrue && elseCode) {
          const innerCode = elseCode.replace(/^\{|\}$/g, '').trim();
          this.executeStatements(this.splitStatements(innerCode));
        }
        return;
      }
    }

    // pinMode(pin, mode)
    const pinModeMatch = cleanStmt.match(/pinMode\s*\(\s*(\d+)\s*,\s*([A-Z_]+)\s*\)/);
    if (pinModeMatch) {
      const pin = parseInt(pinModeMatch[1], 10);
      const mode = pinModeMatch[2] as 'INPUT' | 'OUTPUT' | 'INPUT_PULLUP';
      this.pinModes[pin] = mode;
      return;
    }

    // digitalWrite(pin, HIGH / LOW)
    const digitalValMatch = cleanStmt.match(/digitalWrite\s*\(\s*(\d+)\s*,\s*(HIGH|LOW|1|0)\s*\)/);
    if (digitalValMatch) {
      const pin = parseInt(digitalValMatch[1], 10);
      const valStr = digitalValMatch[2];
      const state = valStr === 'HIGH' || valStr === '1';
      this.pinStates[pin] = state;
      this.callbacks.onPinChange(pin, state);
      this.callbacks.onStateUpdate({ ...this.pinStates });
      return;
    }

    // Serial.println("msg") or Serial.println(val)
    const serialMatch = cleanStmt.match(/Serial\.(?:println|print)\s*\(\s*(.*?)\s*\)/);
    if (serialMatch) {
      let rawVal = serialMatch[1].trim();
      // Remove quotes if string literal
      if ((rawVal.startsWith('"') && rawVal.endsWith('"')) || (rawVal.startsWith("'") && rawVal.endsWith("'"))) {
        rawVal = rawVal.slice(1, -1);
      } else if (rawVal.startsWith('analogRead')) {
        rawVal = '512';
      } else if (rawVal.startsWith('digitalRead')) {
        const pMatch = rawVal.match(/\d+/);
        const p = pMatch ? parseInt(pMatch[0], 10) : 2;
        rawVal = this.pinStates[p] ? 'HIGH (1)' : 'LOW (0)';
      }
      this.callbacks.onSerialOutput(rawVal);
      return;
    }
  }
}
