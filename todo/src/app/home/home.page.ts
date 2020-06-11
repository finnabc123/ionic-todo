import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {
  public title: string = 'To Do'
  public workName: string = ''
  private editWorkId: number = 0;
  public items: todos[] = [
    {
      id: 2,
      todoName: 'Buying Apple',
      isChecked: false
    },
    {
      id: 3,
      todoName: 'Buying Orange',
      isChecked: false
    }
  ]

  constructor() { }

  public onEditing(item: todos) {
    this.editWorkId = item.id;
    this.workName = item.todoName;
  }

  public onDeleting(item: todos) {
    this.editWorkId = 0;
    this.items = this.items.filter(i => i.id !== item.id);
  }

  public onAddWork(work: string) {
    if (this.editWorkId) {
      this.items.find((itm, indx) => {
        if (itm.id === this.editWorkId) {
          this.items[indx].todoName = work;
        }
      });
    } else {
      this.editWorkId = 0;
      this.items.unshift({
        id: + (Math.random().toString().replace('.', '')),
        todoName: work,
        isChecked: false
      });
    }
    setTimeout(() => {
      this.workName = '';
    }, 100);
  }

}


interface todos {
  id: number
  todoName: string,
  isChecked: boolean
}
