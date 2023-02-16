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
    color: "red",
    amount: 3,
  },
  [PasswordStrength.Weak]: {
    color: "red",
    amount: 1,
  },
  [PasswordStrength.Medium]: {
    color: "yellow",
    amount: 2,
  },
  [PasswordStrength.Strong]: {
    color: "green",
    amount: 3,
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
      this.setBarColors(
        typeToConfig[pwdStrength]
      );
    } else {
      this.resetColors();
    }
  }

  private createBars(): string[] {
    const bars: string[] = [];

    for (let i = 0; i < BARS_NUM; i++) {
      bars.push('');
    }

    return bars;
  }

  private resetColors() {
    this.bars = this.createBars();
  }

  private setBarColors(obj: {color: string, amount: number}) {
    this.resetColors();
      for (let i = 0; i < obj.amount; i++) {
        this.bars[i] = obj.color;
      }
  }
}
