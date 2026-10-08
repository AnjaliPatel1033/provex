import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollRevealDirective } from '../../animations/scroll-reveal.directive';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, ScrollRevealDirective],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent {
  projects = [
    {
      title: 'Industrial Product',
      tag: 'Product Design',
      imageClass: 'project-img-1'
    },
    {
      title: 'Engineering Analysis',
      tag: 'FEA / Simulation',
      imageClass: 'project-img-2'
    },
    {
      title: 'Prototype Development',
      tag: 'Prototype',
      imageClass: 'project-img-3'
    }
  ];
}
