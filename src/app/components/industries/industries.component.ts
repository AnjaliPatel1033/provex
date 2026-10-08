import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollRevealDirective } from '../../animations/scroll-reveal.directive';

@Component({
  selector: 'app-industries',
  standalone: true,
  imports: [CommonModule, ScrollRevealDirective],
  templateUrl: './industries.component.html',
  styleUrls: ['./industries.component.scss']
})
export class IndustriesComponent {
  industries = [
    { 
      title: 'Automotive', 
      description: 'Precision parts, assemblies, and testing for the mobility sector.',
      imageUrl: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&q=80&w=600'
    },
    { 
      title: 'Robotics', 
      description: 'Mechanical design and housing for automation and robotic systems.',
      imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=600'
    },
    { 
      title: 'Manufacturing', 
      description: 'Tooling, fixtures, and process optimization for mass production.',
      imageUrl: 'https://images.unsplash.com/photo-1565514020179-026b92b84bb6?auto=format&fit=crop&q=80&w=600'
    },
    { 
      title: 'Consumer Products', 
      description: 'Ergonomic, aesthetic, and manufacturable designs for end-users.',
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600'
    },
    { 
      title: 'Medical Devices', 
      description: 'High-precision engineering meeting strict regulatory standards.',
      imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=600'
    },
    { 
      title: 'Startups', 
      description: 'Rapid, risk-averse development to help founders get to market faster.',
      imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32b7?auto=format&fit=crop&q=80&w=600'
    }
  ];
}
