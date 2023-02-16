import {
  Component,
  Input,
  OnChanges,
  SimpleChange,
  Output,
  EventEmitter,
} from '@angular/core';

enum PasswordStrength {
  Short = 0,
  Weak = 1,
  Medium = 2,
  Strong = 3,
}

const typeToConfig = {
  [PasswordStrength.Short]: {
    color: 'red',
    amount: 3,
    message: 'Your password is too short',
    className: 'error',
  },
  [PasswordStrength.Weak]: {
    color: 'red',
    amount: 1,
    message: 'Your password is too weak',
    className: 'error',
  },
  [PasswordStrength.Medium]: {
    color: 'yellow',
    amount: 2,
    message: 'Your password is medium strenght',
    className: 'warn',
  },
  [PasswordStrength.Strong]: {
    color: 'green',
    amount: 3,
    message: 'Your password is perfect!',
    className: 'success',
  },
};

const BARS_NUM = 3;
const MINIMUM_LENGTH = 8;

@Component({
  selector: 'app-password-check',
  templateUrl: './password-check.component.html',
  styleUrls: ['./password-check.component.css'],
})
export class PasswordCheckComponent implements OnChanges {
  @Input() public passwordToCheck?: string;
  @Output() passwordStrength = new EventEmitter<boolean>();

  bars: string[];
  message = '';
  messageClassName = '';

  constructor() {
    this.bars = this.createBars();
  }

  private checkStrength(pass: string): PasswordStrength {
    if (pass.length < MINIMUM_LENGTH) {
      return PasswordStrength.Short;
    }

    const letters = /[a-zA-Z]+/.test(pass);
    const numbers = /[0-9]+/.test(pass);
    const symbols = /[$-/:-?{-~!"^_@`\[\]]/g.test(pass);

    const flags = [letters, numbers, symbols];

    const passedMatches = flags.reduce((acc, flag) => {
      if (flag) {
        return acc + 1;
      }
      return acc;
    }, 0);

    return passedMatches;
  }

  ngOnChanges(changes: { [propName: string]: SimpleChange }): void {
    const password: string = changes['passwordToCheck'].currentValue;

    if (password.length > 0) {
      const pwdStrength = this.checkStrength(password);

      if (typeToConfig[pwdStrength] !== undefined) {
        const config = typeToConfig[pwdStrength];
        this.setBarColors(config);
        // this.messageClassName = config.className;
        // this.message = config.message;
      } else {
        this.reset();
      }
    } else {
      this.reset();
    }
  }

  private createBars(): string[] {
    const bars: string[] = [];

    for (let i = 0; i < BARS_NUM; i++) {
      bars.push('');
    }

    return bars;
  }

  private reset() {
    this.message = '';
    this.messageClassName = '';
    this.bars = this.createBars();
  }

  private setBarColors({color, amount, message, className}: { color: string; amount: number , message: string, className: string}) {
    this.reset();
    for (let i = 0; i < amount; i++) {
      this.bars[i] = color;
      this.message = message;
      this.messageClassName = className;
    }
  }
}
