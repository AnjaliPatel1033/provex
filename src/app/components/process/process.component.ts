import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollRevealDirective } from '../../animations/scroll-reveal.directive';

@Component({
  selector: 'app-process',
  standalone: true,
  imports: [CommonModule, ScrollRevealDirective],
  templateUrl: './process.component.html',
  styleUrls: ['./process.component.scss']
})
export class ProcessComponent {
  steps = [
    { title: 'Idea', desc: 'Understand the need' },
    { title: 'Concept', desc: 'Develop solutions' },
    { title: 'CAD', desc: 'Build the design' },
    { title: 'Simulation', desc: 'Validate performance' },
    { title: 'Prototype', desc: 'Build & test' },
    { title: 'Production', desc: 'Manufacture & launch' }
  ];
}
