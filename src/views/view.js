/**
 * @author Davide Spano
 */

import {Bounds} from "../layout/bounds";

function View(){
    this.bounds = new Bounds();
    this.name = "";
    this.children = [];
    this.isView = true;
    this.parent = null;
}

Object.assign(View.prototype, {
    setBounds : function(bounds){
        this.bounds = bounds;
        return this;
    },

    getBounds : function(){
        return this.bounds;
    },

    setName : function(name){
        this.name = name;
        return this;
    },

    getName : function(){
        return name;
    },

    addChild: function(c){
        if(!c){
            return this;
        }
        if(c.isView){
            this.children.push(c);
            c.parent = this;
        }
        return this;
    },


    paintChildren: function(g, b){
        for(let c of this.children){
            g.save();
            g.translate(c.bounds.x, c.bounds.y);
            c.paint(g);
            g.restore();
        }
    },

    paint: function(g, b){
        let r = b || this.bounds;

        g.save();
        // setting the clipping region. The view cannot draw outside its bounds
        g.beginPath();
        g.rect(r.x, r.y, r.w, r.h);
        g.clip();

        g.strokeStyle = "black";
        g.strokeRect(
            0,
            0,
            this.bounds.w,
            this.bounds.h);

        // draw the children views.
        this.paintChildren(g,r);
        g.restore();

    },

    invalidate : function(r, source){
        source = source || this;
        if(this.parent != null){
            // move to the parent reference system
            let damagedArea = new Bounds(
                this.bounds.x + r.x,
                this.bounds.y + r.y,
                r.w, r.h);
            // intersect the requested area with the current bounds
            damagedArea = damagedArea.intersection(this.bounds);

            // bubble up the request to the parent
            this.parent.invalidate(damagedArea, source);
        }
    }
});

export {View};
