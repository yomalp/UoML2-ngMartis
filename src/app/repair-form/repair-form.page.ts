import { Component, OnInit } from '@angular/core';
import { AlertController, Platform } from '@ionic/angular';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';

import { CreateRepairService } from 'src/app/services/create-repair.service';

@Component({
	selector: 'app-repair-form',
	templateUrl: './repair-form.page.html',
	styleUrls: [ './repair-form.page.scss' ]
})
export class RepairFormPage implements OnInit {
	results: object[];

	//autofill elements
	assetid: String;
	engineerid: String;
	comments: String;
	createddate = String;

	opost = new Posts();

	//platform
	desktop: boolean = true;

	createRepairForm = this.formBuilder.group({
		AssetId: [ '', [ Validators.required, Validators.pattern('^A[0-9]{3}'), Validators.maxLength(4) ] ],
		EngineerID: [ '', [ Validators.required, Validators.pattern('^EMP[0-9]{3}') ] ],
		CreatedDate: [ '' ],
		CompletedDate: [ '' ],
		comments: [ '' ]
	});
	ngOnInit() {
		console.log(this.route.snapshot.params.assetid);
		let date = new Date(this.route.snapshot.params.createddate);
		console.log(this.datePipe.transform(date, 'yyyy-MM-dd HH:mm:ss'));
		this.assetid = this.route.snapshot.params.assetid;
		this.engineerid = this.route.snapshot.params.engineerid;
		this.comments = this.route.snapshot.params.comments;
		this.createddate = this.route.snapshot.params.createddate;

		if (this.plt.is("mobile") || this.plt.is("android") || this.plt.is("ios")) {
			this.desktop =false;
		} else if (this.plt.is("desktop")) {
			this.desktop = true;
		}
	}

	constructor(
		private formBuilder: FormBuilder,
		private setRepair: CreateRepairService,
		private alertCtrl: AlertController,
		private route: ActivatedRoute,
		private datePipe: DatePipe,
		private plt: Platform
	) {}

	onSave() {
		if(!this.desktop){
			//sqlite code
			return;
		}
		let date = this.route.snapshot.params.createddate;
		this.opost = this.createRepairForm.value;
		this.opost.CreatedDate = this.datePipe.transform(date, 'yyyy-MM-dd HH:mm:ss').toString();
		this.opost.CompletedDate = this.datePipe.transform(this.opost.CompletedDate, 'yyyy-MM-ddThh:mm:ss.000') + 'Z';
		console.log(this.opost.CompletedDate);

		console.log('Page Saved', this.opost);

		this.setRepair.put(this.opost).subscribe((data) => {
			console.log('Post method success?: ', data);
			if (data) {
				this.showAlert(true);
			} else {
				this.showAlert(false);
			}
		});
	}

	async showAlert(val) {
		await this.alertCtrl
			.create({
				header: 'Result',
				message: val ? 'Repair added Successfully' : 'Error',
				buttons: [
					{
						text: 'OK',
						handler: () => {
							this.createRepairForm.reset();
						}
					}
				]
			})
			.then((res) => res.present());
	}
}
export class Posts {
	AssetId: string;
	CreatedDate: string;
	CompletedDate: string;
	comments: string;
}
