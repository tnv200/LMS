package com.torryharris.BackEndSample.Entity;

import jakarta.persistence.*;

@Entity
public class Tag {

	@Id
    @Column(name = "tag_id")
    private Integer tagid;

    @Column(name = "tag_name")
    private String tagname;

	public Integer getTagid() {
		return tagid;
	}

	public void setTagid(Integer tagid) {
		this.tagid = tagid;
	}

	public String getTagname() {
		return tagname;
	}

	public void setTagname(String tagname) {
		this.tagname = tagname;
	}

	@Override
	public String toString() {
		return "Tag [tagid=" + tagid + ", tagname=" + tagname + "]";
	}

	public Tag(Integer tagid, String tagname) {
		super();
		this.tagid = tagid;
		this.tagname = tagname;
	}

	public Tag() {
		super();
	}

 
}
