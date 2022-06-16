import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {UtilService} from '../../services/util.service';

@Component({
  selector: 'app-review-success',
  templateUrl: './review-success.component.html',
  styleUrls: ['./review-success.component.scss']
})
export class ReviewSuccessComponent implements OnInit {
  public reviewType: any;

  constructor(private route: ActivatedRoute, public util: UtilService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe( data => {
      this.reviewType = data.review;
      console.log('these are review type', this.reviewType);
    });

  }

}
