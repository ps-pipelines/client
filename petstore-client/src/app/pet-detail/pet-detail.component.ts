import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Pet }         from '../pet';
import { PetService }  from '../pet.service';

@Component({
  selector: 'app-pet-detail',
  templateUrl: './pet-detail.component.html',
  styleUrls: [ './pet-detail.component.css' ]
})
export class PetDetailComponent implements OnInit {
  @Input() pet: Pet;

  constructor(
    private route: ActivatedRoute,
    private petService: PetService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.getPet();
  }

  getPet(): void {
    const id = this.route.snapshot.params["id"];
    this.petService.getHero(id)
      .subscribe(pet => this.pet = pet);
  }

  goBack(): void {
    this.location.back();
  }

 save(): void {
    this.petService.updatePet(this.pet)
      .subscribe(() => this.goBack());
  }
}
